import React from 'react'
/**
 * Handles the Select action in a DOM element
 */

export default class SelectionHandler extends React.Component {
  constructor (props) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleDeselect = this.handleDeselect.bind(this)
  }

  componentDidMount () {
    if (this.props.onSelect) {
      document.addEventListener('keyup', this.handleSelect)
      document.addEventListener('mouseup', this.handleSelect)
      document.addEventListener('click', this.handleSelect)
      document.addEventListener('dblclick', this.handleSelect)
      document.addEventListener('scroll', this.handleSelect)
    }

    if (this.props.onDeselect) {
      document.addEventListener('selectionchange', this.handleDeselect)
    }
  }

  componentWillUnmount () {
    if (this.props.onSelect) {
      document.removeEventListener('keyup', this.handleSelect)
      document.removeEventListener('mouseup', this.handleSelect)
      document.removeEventListener('click', this.handleSelect)
      document.removeEventListener('dblclick', this.handleSelect)
      document.removeEventListener('scroll', this.handleSelect)
    }

    if (this.props.onDeselect) {
      document.removeEventListener('selectionchange', this.handleDeselect)
    }
  }

  handleSelect () {
    const selection = document.getSelection()

    if (selection.rangeCount !== 1 || !this.node) {
      return this.props.onDeselect()
    }

    const range = selection.getRangeAt(0)

    if (range.collapsed) {
      return this.props.onDeselect()
    }

    const ancestor = range.commonAncestorContainer
    const isValidSelection = this.node.contains(ancestor) ||
                           this.node.isSameNode(ancestor)

    if (!isValidSelection) {
      return this.props.onDeselect()
    }

    if (isValidSelection) {
      const prefixRange = document.createRange()
      prefixRange.setStart(this.node, 0)
      prefixRange.setEnd(range.startContainer, range.startOffset)

      const prefix = prefixRange.toString()
      const exact = range.toString()
      const suffix = this.node.textContent.slice(prefix.length + exact.length)

      if (exact !== '') {
        this.props.onSelect({ prefix, exact, suffix }, range)
      }
    }
  }

  handleDeselect () {
    const selection = document.getSelection()

    if (selection.rangeCount !== 1 || !this.node) {
      return this.props.onDeselect()
    }

    const range = selection.getRangeAt(0)

    if (range.collapsed) {
      return this.props.onDeselect()
    }

    const ancestor = range.commonAncestorContainer
    const isValidSelection = this.node.contains(ancestor) ||
                             this.node.isSameNode(ancestor)

    if (!isValidSelection) {
      return this.props.onDeselect()
    }
  }

  render () {
    return (
      <span
        ref={node => { this.node = node }}
      >
        {this.props.children}
      </span>
    )
  }
}
