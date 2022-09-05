import { Cookbook } from "../models/Cookbook";
import passport from "passport";
import createError from "http-errors";
import jwt from "jsonwebtoken";

export const auth = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // anything that was passed in the arguments in instance method (it can be empty)
      const req = args[0];
      const res = args[1];
      const next = args[3];
      //   const token = req.cookies.token;
      const user = req.user;
      console.log("AUTHENTICATING...: ", user);
      return fn.apply(this, args);
    };
  };
};
