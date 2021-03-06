import { Controller } from 'stimulus'
import NoteEditor from './note/note_editor'
import Note from '../models/note'

export default class NoteEditorController extends Controller {
  static targets = ['loader', 'titleMerger']

  // https://github.com/stimulusjs/stimulus/search?q=targets+typescript&type=Issues
  loaderTarget: HTMLElement
  titleMergerTarget: HTMLElement

  private mode: string // note/block

  private note: Note
  private editor: NoteEditor

  private updatingTitle: boolean = false
  private updatingBlocks: boolean = false

  connect() {
    console.log('stimulus: note editor connected on:')
    console.log(this.element)

    this.mode = this.data.get('mode')

    this.note = new Note(
      this.data.get('note-id'),
      this.data.get('note-title')
    )

    this.initEditor()

    this.refreshLoader()
  }

  private initEditor() {
    this.editor = new NoteEditor(
      this,
      this.element,
      JSON.parse(this.data.get('note-content')),
      JSON.parse(this.data.get('available-tags')),
    )
    this.editor.focusAtEnd()
  }

  public updateTitle(title: string) {
    this.setUpdatingTitle(true)
    this.note.updateTitleLater(
      title,
      () => this.handleTitleUpdated(),
    )
  }

  private handleTitleUpdated() {
    this.setUpdatingTitle(false)
  }

  public updateBlocks(blocks: JSON[]) {
    this.setUpdatingBlocks(true)
    this.note.updateBlocksLater(
      blocks,
      () => this.handleBlocksUpdated()
    )
  }

  private handleBlocksUpdated() {
    this.setUpdatingBlocks(false)
  }

  private setUpdatingTitle(value: boolean) {
    this.updatingTitle = value
    this.refreshLoader()
  }

  private setUpdatingBlocks(value: boolean) {
    this.updatingBlocks = value
    this.refreshLoader()
  }

  private refreshLoader() {
    let loading = this.updatingTitle || this.updatingBlocks
    let visibility = loading ? 'visible' : 'hidden'
    this.loaderTarget.style.visibility = visibility
  }
}
