import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Upload } from "./Upload";
import { Post } from "./Post";
import { Collection } from "./Collection";
import { Car } from "./Car";
import { Model } from "./Model";

@Entity()
export class Make {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Car, car => car.make)
  cars: Car[];

  @OneToMany(type => Model, model => model.make)
  models: Model[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
