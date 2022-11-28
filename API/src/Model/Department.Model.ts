import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import sequelize from '../Config/db';

interface DepartmentModelInterface extends Model<InferAttributes<DepartmentModelInterface>, InferCreationAttributes<DepartmentModelInterface>> {
    id: string;
    name: string;
    description: string;
    ceo: boolean;
}

const DepartmentModel = sequelize.define<DepartmentModelInterface>('Department', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    ceo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

DepartmentModel.hasMany(DepartmentModel)
DepartmentModel.belongsTo(DepartmentModel)

export default DepartmentModel;
