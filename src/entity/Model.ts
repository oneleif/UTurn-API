import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Upload } from "./Upload";
import { Post } from "./Post";
import { Collection } from "./Collection";
import { Car } from "./Car";
import { Make } from "./Make";

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modelName: string;

  @Column({ nullable: true })
  year: number;

  @OneToMany(type => Car, car => car.model)
  cars: Car[];

  @ManyToOne(type => Make, make => make.models)
  make: Make;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
