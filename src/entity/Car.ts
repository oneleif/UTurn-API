import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Upload } from "./Upload";
import { Post } from "./Post";
import { Collection } from "./Collection";
import { Make } from "./Make";
import { Model } from "./Model";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  nickname?: string;

  @ManyToOne(type => User, user => user.cars)
  user: User;

  @ManyToOne(type => Make, make => make.cars)
  make: Make;

  @ManyToOne(type => Model, model => model.cars)
  model: Model;

  @OneToMany(type => Upload, upload => upload.post)
  collections: Collection[];

  @OneToMany(type => Post, post => post.car)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
