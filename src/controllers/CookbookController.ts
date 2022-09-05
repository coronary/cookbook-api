import { Use } from "@tsed/common";
import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { auth } from "../middleware/Auth";
import { Cookbook } from "../models/Cookbook";
import { BaseController } from "./BaseController";

export class CookbookController extends BaseController<Cookbook> {
  constructor() {
    super(Cookbook, "cookbook");
  }

  @auth()
  async getAll(req, res) {
    super.getAll(req, res);
  }
}
