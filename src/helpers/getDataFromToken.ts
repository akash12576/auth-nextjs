import { NextRequest } from "next/server";
// @ts-ignore jsonwebtoken typings are not installed
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
       const  decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!)
       return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message)
    }
}
