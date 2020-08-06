import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Upload } from "./Upload";
import { Car } from "./Car";
import { Post } from "./Post";

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Car, car => car.collections)
  car: Car;

  @ManyToOne(type => User, user => user.collections)
  user: User;

  @OneToMany(type => Post, post => post.collection)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
