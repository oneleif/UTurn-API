import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Upload } from "./Upload";
import { Car } from "./Car";
import { Collection } from "./Collection";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.posts)
  user: User;

  @OneToMany(type => Upload, upload => upload.post)
  uploads: Upload[];

  @ManyToOne(type => Collection, collection => collection.posts)
  collection: Collection;

  @ManyToOne(type => Car, car => car.posts)
  car: Car;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
