import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileEndpoint: string;

  @ManyToOne(type => Post, post => post.uploads)
  post: Post;

  @ManyToOne(type => User, user => user.uploads)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
