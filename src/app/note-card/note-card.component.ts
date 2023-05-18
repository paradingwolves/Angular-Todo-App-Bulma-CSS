import { Component, ElementRef, OnInit, ViewChild, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() title!: string;
  @Input() body!: string;


  @ViewChild('truncator') truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText!: ElementRef<HTMLElement>;
  
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Wrap the code inside a timeout to ensure that the view is fully initialized
    setTimeout(() => {
      this.checkTextOverflow();
    });
  }

  private checkTextOverflow(): void {
    if (this.truncator && this.truncator.nativeElement && this.bodyText && this.bodyText.nativeElement) {
      const truncatorElement = this.truncator.nativeElement;
      const bodyTextElement = this.bodyText.nativeElement;

      const viewableHeight = bodyTextElement.clientHeight;
      const scrollHeight = bodyTextElement.scrollHeight;

      if (scrollHeight > viewableHeight) {
        // If there is text overflow, show the truncator
        this.renderer.setStyle(truncatorElement, 'display', 'block');
      } else {
        // If there is no text overflow, hide the truncator
        this.renderer.setStyle(truncatorElement, 'display', 'none');
      }
    }
  }
}
