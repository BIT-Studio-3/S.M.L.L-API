import STATUS_CODES from "../../utils/statusCode.js";
import { Prisma } from "@prisma/client";

const createEntity = (repository) => async (req, res) => {
  try {
    await repository.create(req.body);
    const newEntities = await repository.findAll();
    return res.status(STATUS_CODES.CREATED).json({
      message: "Entity successfully created",
      data: newEntities,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(STATUS_CODES.EXISTS).json({
          message: "Entity with the same name already exists",
        });
      }
    } else {
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        message: err.message,
      });
    }
  }
};

const getEntities = (repository) => async (req, res) => {
  try {
    const entities = await repository.findAll();
    if (!entities) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "No entities found" });
    }
    return res.status(STATUS_CODES.OK).json({
      data: entities,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getEntity = (repository) => async (req, res) => {
  try {
    const entity = await repository.findById(req.params.id);
    if (!entity) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No entity with the id: ${req.params.id} found`,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      data: entity,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      message: err.message,
    });
  }
};
const getEmailResource = async (req, res, model) => {
  try {
    const resource = await prisma[model].findUnique({
      where: { email: String(req.params.email) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the email: ${req.params.email} found` });
    }

    return res.json({
      data: resource,
    });
  } catch (err) {
    return handleErrorResponse(res, err);
  }
};
const updateEntity = (repository) => async (req, res) => {
  try {
    let entity = await repository.findById(req.params.id);
    if (!entity) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No entity with the id: ${req.params.id} found`,
      });
    }
    entity = await repository.update(req.params.id, req.body);
    return res.status(STATUS_CODES.OK).json({
      message: `Entity with the id: ${req.params.id} successfully updated`,
      data: entity,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(STATUS_CODES.EXISTS).json({
          message: "Entity with the same name already exists",
        });
      }
    } else {
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        message: err.message,
      });
    }
  }
};

const deleteEntity = (repository) => async (req, res) => {
  try {
    const entity = await repository.findById(req.params.id);
    if (!entity) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No entity with the id: ${req.params.id} found`,
      });
    }
    await repository.delete(req.params.id);
    return res.json({
      message: `Entity with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export {
  createEntity,
  getEntities,
  getEmailResource,
  getEntity,
  updateEntity,
  deleteEntity,
};
