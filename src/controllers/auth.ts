import { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup";
import { findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";

export const signup: RequestHandler = async (req, res) => {
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

    res.json({});
}   