import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable, RelationCount } from "typeorm";
import { Post } from "./Post";
import { Upload } from "./Upload";
import { Collection } from "./Collection";
import { Car } from "./Car";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    displayName?: string;

    @Column()
    hash: string;

    @Column({ nullable: true })
    sessionKey?: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ default: false })
    private: boolean;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @OneToMany(type => Collection, collection => collection.user)
    collections: Collection[];

    @OneToMany(type => Upload, upload => upload.user)
    uploads: Upload[];

    @OneToMany(type => Car, car => car.user)
    cars: Car[];

    @ManyToMany(type => User, user => user.following)
    @JoinTable()
    followers: User[];

    @ManyToMany(type => User, user => user.followers)
    following: User[];

    @RelationCount((user: User) => user.followers)
    followersCount: number;
    
    @RelationCount((user: User) => user.following)
    followingCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
