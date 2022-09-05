import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { Cookbook } from "../models/Cookbook";
import { BaseController } from "./BaseController";

export class CookbookController extends BaseController<Cookbook> {
  constructor() {
    super(Cookbook, "cookbook");
  }
}
