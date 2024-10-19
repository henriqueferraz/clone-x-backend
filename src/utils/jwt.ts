import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserBySlug } from "../services/user";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = (slug: string) => {
    return jwt.sign({ slug }, process.env.JWT_SECRET as string)
}

export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHrader = req.headers['authorization'];
    if (!authHrader) {
        return res.status(401).json({ error: 'Acesso Negado' });
    }

    const token = authHrader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        // Houve algum erro com o token?
        async (error, decoded: any) => {
            if (error) {
                return res.status(401).json({ error: 'Acesso Negado' });
            }

            // Esse usuário existe?
            const user = await findUserBySlug(decoded.slug);
            if (!user) {
                return res.status(401).json({ error: 'Acesso Negado' });
            }

            // qual o usuario que está logado?
            req.userSlug = user.slug;
            next();
        }
    )
}