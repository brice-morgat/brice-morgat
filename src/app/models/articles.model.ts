export class Article {
    photo: string = '';
    date: string = '';
    id: string = '';
    
    constructor(public title: string, public author: string, public content: string, public desc:string) {}
}