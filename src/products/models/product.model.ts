import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'products'
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  })
  product_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  product_name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  product_quantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  account_name: string;
}
