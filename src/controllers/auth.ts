import { Response } from "express";
import { signupSchema } from "../schemas/signup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";
import { ExtendedRequest } from "../types/extended-request";

export const signup = async (req: ExtendedRequest, res: Response) => {
    // validar os dados recebidos
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ error: safeData.error.flatten().fieldErrors });
    }

    // verificar email
    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
        return res.json({ error: 'E-mail já cadastrado' });
    }

    // verificar slug
    let gerarSlug = true;
    let userSlug = slug(safeData.data.name);
    while (gerarSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if (hasSlug) {
            let slugSuffix = Math.floor(Math.random() * 999999).toString();
            userSlug = slug(safeData.data.name + slugSuffix);
        } else {
            gerarSlug = false;
        }
    }

    // gerar hash de senha
    const hashPassword = await hash(safeData.data.password, 10);

    // criar o usuário
    const newUser = await createUser({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword
    });

    // criar o token
    const token = createJWT(userSlug);

    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            slug: newUser.slug,
            avatar: newUser.avatar
        }
    });
}

export const signin = async (req: ExtendedRequest, res: Response) => {
    // validar os dados recebidos
    const safeData = signinSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ error: safeData.error.flatten().fieldErrors });
    }

    // verificar email
    const user = await findUserByEmail(safeData.data.email);
    if (!user) {
        return res.status(401).json({ error: 'Acesso negado' });
    }

    // verificar senha
    const verifyPass = await compare(safeData.data.password, user.password);
    if (!verifyPass) {
        return res.status(401).json({ error: 'Acesso negado' });
    }
    // criar token de acesso
    const token = createJWT(user.slug);

    res.json({
        token,
        user: {
            name: user.name,
            slug: user.slug,
            avatar: user.avatar
        }
    });
}