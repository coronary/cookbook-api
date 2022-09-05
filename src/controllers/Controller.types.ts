export interface Controller {
  setRoutes: () => void;
  create: (req, res) => void;
  update: (req, res) => void;
  delete: (req, res) => void;
  get: (req, res) => void;
  getAll: (req, res) => void;
}
