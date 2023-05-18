import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router'; // Correct import for Router
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  note!: Note; // Declare note property and indicate it will be assigned later
  noteId!: number;
  new!: boolean;

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    // find out if we are creating a new note or editng an existing one
    this.route.params.subscribe((params: Params) => {
    this.note = new Note('', ''); // Create a new instance of Note with empty title and body

      if (params['id']) {
        this.note = this.notesService.get(params['id']);
        this.noteId = params['id'];
        this.new = false;
      } else {
        this.new = true;
      }
    })

  }

  onSubmit(form: NgForm) {
    if (this.new) {
      // save the note
      this.notesService.add(form.value);
    } else {
      this.notesService.update(this.noteId, form.value.title, form.value.body);
    }
    this.router.navigateByUrl('/');
    
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
