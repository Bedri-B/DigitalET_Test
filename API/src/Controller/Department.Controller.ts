import DepartmentModel from "../Model/Department.Model";
import evalidate from "evalidate";
import {Op} from "sequelize";

exports.List = async (req, res) => {
  try {
    const departments = await DepartmentModel.findAll();
    const response = {
      status: 200,
      message: "Done",
      data: departments,
    };
    res.status(200).json(response);
  } catch (e) {
    const response = {
      status: 500,
      message: "Internal Server Error",
      data: e.toString(),
    };
    res.status(response.status).send(response);
  }
};

exports.Create = async (req, res) => {
  try {
    const schema = new evalidate.schema({
      name: evalidate.string().required(),
      description: evalidate.string().required(),
      DepartmentId: evalidate.string().required(),
    });
    const data = req.body;
    const validation = schema.validate(data);
    if (validation.isValid) {
      const headDepartment = await DepartmentModel.findByPk(
        data["DepartmentId"]
      );
      const sameNameDepartment = await DepartmentModel.findOne({
        where: {
          name: data["name"],
        },
      });
      if (headDepartment && !sameNameDepartment) {
        const department = await DepartmentModel.create(data);
        const response = {
          status: 200,
          message: "Department created successfully",
          data: department,
        };
        res.status(200).json(response);
      } else {
        const errorBody = [];
        if (!headDepartment) errorBody.push("Managing Department not found");
        if (sameNameDepartment)
          errorBody.push(
            "Department with the name '" + data["name"] + "' already exists"
          );

        const response = {
          status: 404,
          message: "Error creating department",
          data: errorBody,
        };
        res.status(response.status).json(response);
      }
    } else {
      const response = {
        status: 400,
        message: "Required inputs missing",
        data: validation.errors,
      };
      res.status(response.status).json(response);
    }
  } catch (e) {
    const response = {
      status: 500,
      message: "Internal Server Error",
      data: e.toString(),
    };
    res.status(response.status).send(response);
  }
};

exports.Get = async (req, res) => {
  try {
    const id = req.params["id"];
    if (id) {
      const department = await DepartmentModel.findByPk(id, {
        include: { model: DepartmentModel },
      });
      if (department) {
        const response = {
          status: 200,
          message: "Done",
          data: department,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          message: "Department not found",
          data: null,
        };
        res.status(response.status).json(response);
      }
    } else {
      const response = {
        status: 400,
        message: "Department ID required",
        data: null,
      };
      res.status(response.status).json(response);
    }
  } catch (e) {
    const response = {
      status: 500,
      message: "Internal Server Error",
      data: e.toString(),
    };
    res.status(response.status).send(response);
  }
};

exports.Update = async (req, res) => {
  try {
    const id = req.params["id"];
    if (id) {
      const department = await DepartmentModel.findOne({
        where: { id: id },
        include: { model: DepartmentModel },
      });
      if (department) {
        const schema = new evalidate.schema({
          name: evalidate.string().required(),
          description: evalidate.string().required(),
          DepartmentId: evalidate.string().required(),
        });
        const data = req.body;
        const validation = schema.validate(data);
        if (validation.isValid) {
          const headDepartment = await DepartmentModel.findByPk(
              data["DepartmentId"]
          );
          const sameNameDepartment = await DepartmentModel.findOne({
            where: {
              id: {
                [Op.not]: id,
              },
              name: data["name"],
            },
          });
          if (headDepartment && !sameNameDepartment) {
            department.update(data);
            department.save();
            const response = {
              status: 200,
              message: "Department updated successfully",
              data: department,
            };
            res.status(200).json(response);
          } else {
            const errorBody = [];
            if (!headDepartment) errorBody.push("Managing Department not found");
            if (sameNameDepartment)
              errorBody.push(
                  "Department with the name '" + data["name"] + "' already exists"
              );

            const response = {
              status: 404,
              message: "Error creating department",
              data: errorBody,
            };
            res.status(response.status).json(response);
          }
        } else {
          const response = {
            status: 400,
            message: "Required inputs missing",
            data: validation.errors,
          };
          res.status(response.status).json(response);
        }
      } else {
        const response = {
          status: 404,
          message: "Department not found",
          data: null,
        };
        res.status(response.status).json(response);
      }
    } else {
      const response = {
        status: 400,
        message: "Required parameter 'ID' missing",
        data: null,
      };
      res.status(response.status).json(response);
    }
  } catch (e) {
    console.log(e);
    const response = {
      status: 500,
      message: "Internal Server Error",
      data: e.toString(),
    };
    res.status(response.status).send(response);
  }
};

exports.Delete = async (req, res) => {
  try {
    const id = req.params["id"];
    if (id) {
      const department = await DepartmentModel.findOne({
        where: { id: id, ceo: false },
        include: { model: DepartmentModel },
      });
      if (department) {
        if (department["Departments"].length === 0) {
          await department.destroy();
          const response = {
            status: 200,
            message: "Department deleted successfully",
            data: null,
          };
          res.status(response.status).json(response);
        } else {
          const response = {
            status: 400,
            message: "Department could not be deleted",
            data: ["Department has Sub-Departments"],
          };
          res.status(response.status).json(response);
        }
      } else {
        const response = {
          status: 404,
          message: "Department not found",
          data: null,
        };
        res.status(response.status).json(response);
      }
    } else {
      const response = {
        status: 400,
        message: "Required parameter 'ID' missing",
        data: null,
      };
      res.status(response.status).json(response);
    }
  } catch (e) {
    const response = {
      status: 500,
      message: "Internal Server Error",
      data: e.toString(),
    };
    res.status(response.status).send(response);
  }
};
