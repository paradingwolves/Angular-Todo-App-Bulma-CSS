export class Note {
    title: string; // Declare title property of type string
    body: string; // Declare body property of type string
  
    constructor(title: string = '', body: string = '') {
      this.title = title; // Assign the provided title argument or an empty string as the initial value of the title property
      this.body = body; // Assign the provided body argument or an empty string as the initial value of the body property
    }
  }
  