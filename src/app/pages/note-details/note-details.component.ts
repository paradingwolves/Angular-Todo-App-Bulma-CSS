import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Correct import for Router
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  note!: Note; // Declare note property and indicate it will be assigned later

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit(): void {
    this.note = new Note('', ''); // Create a new instance of Note with empty title and body
  }

  onSubmit(form: NgForm) {
    // save the note
    this.notesService.add(form.value);
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
