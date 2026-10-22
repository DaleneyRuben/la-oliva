import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import ClientHistory from './ClientHistory';
import Payment from './Payment';
import Subscription from './Subscription';

@Table({ tableName: 'clients', timestamps: true, paranoid: true })
class Client extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare sex: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare dateOfBirth: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phoneNumber: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare deliveryZone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare delivery: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deliveryShift: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare nit: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare businessName: string | null;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  declare underlyingDiseases: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  declare restrictions: string[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isDraft: boolean;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare preferredStartDate: string | null;

  @Column({ type: DataType.DECIMAL(6, 2), allowNull: true })
  declare weight: number | null;

  @Column({ type: DataType.DECIMAL(6, 2), allowNull: true })
  declare height: number | null;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  declare operations: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  declare medications: string[];

  @Column({ type: DataType.UUID, allowNull: true, defaultValue: null })
  declare groupToken: string | null;

  @HasMany(() => Subscription)
  declare subscriptions: Subscription[];

  @HasMany(() => ClientHistory)
  declare history: ClientHistory[];

  @HasMany(() => Payment)
  declare payments: Payment[];
}

export default Client;
