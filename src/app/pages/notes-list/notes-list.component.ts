import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // entry animation
      transition('void => *', [
        // set initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // we have to expand out padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }),
        // we want to animate the spacing (includes height, padding and margin)
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*'
        })),
        animate(77)
      ]),
      transition('* => void', [
        // scale up first
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // then scale down back to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        //scale down and fade out entirely
        animate('120ms ease-out', style ({
          transform: 'scale(0.68)',
          opacity: 0
        })),
        // animate the spacing (includes height, padding and margin)
        animate('120ms ease-out', style({
          opacity: 0,
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          'margin-bottom': 0
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100, [
            animate('0.3s ease')
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  
  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    // retrieve all notes from NotesService
    this.notes = this.notesService.getAll();
    this.filteredNotes = this.notesService.getAll();
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note) {
    let noteId = this.notesService.getId(note);
    return noteId;
  }

  filter(query: string | null) {
    if (query !== null) {
      query = query.toLowerCase().trim();

      let allResults: Note[] = new Array<Note>();
      // split search query to individual words
      let terms: string[] = query.split(' '); // split on spaces
      // remove duplicate search terms
      terms = this.removeDuplicates(terms);
      // compile all relevant results into the allResults array
      terms.forEach(term => {
        let results: Note[] = this.relevantNotes(term);
        // append results to allResults array
        allResults = [...allResults, ...results];
      });

      // all results will include duplicate notes
      // because a particular note can be the result of many search terms
      // we do not want to show the same note multiple times so we must remove dupes
      let uniqueResults = this.removeDuplicates(allResults);
      this.filteredNotes = uniqueResults;

      // sort by relevancy 
      this.sortByRelevancy(allResults);
    }
  }


  removeDuplicates(arr:Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // loop through the input array and add items to the set
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string) : Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if ( note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    let noteCountObj: { [key: string]: number } = {};  // format - key:value => NoteId:number (note object id : count)
  
    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note); // get the note's id
  
      if(noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  } 
}
