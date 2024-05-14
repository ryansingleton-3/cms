import { list } from "postcss";

export class Document {
    public id: number;
    public name: string;
    public description: string;
    public url: string;
    public children: any[]; // Replace 'list' with a valid type or interface
    

    constructor(id: number, name: string, description: string, url: string, children: any[]) { // Update the parameter type as well
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.children = children;
        
    }
  }
  