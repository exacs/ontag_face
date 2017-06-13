import React from 'react'
import { connect } from 'react-redux'
import zipWith from 'lodash/fp/zipWith'

import Annotator from '../components/annotator'
import Selector from '../components/annotator-drawer/selector'
import LiqenCreator from '../components/annotator-drawer/liqen-creator'
import { createAnnotation } from '../actions/index'

// const question = JSON.parse(window.QUESTION)
// const tags = question

function convertObjectToReact (obj, key) {
  if (typeof obj === 'string') {
    return obj
  } else {
    const children = obj.children.map((item, i) => convertObjectToReact(item, i))

    if (children.length === 1) {
      return React.createElement(obj.name, Object.assign({key}, obj.attrs), children[0])
    } else {
      return React.createElement(obj.name, Object.assign({key}, obj.attrs), children)
    }
  }
}

const EncapsulatedArticle = ({ onCreateAnnotation, tags }) => (
  <div>
    {
      JSON.parse(window.BODY_JSON).children.map((child, i) => (
        <Annotator
          key={i}
          annotations={[]}
          tags={tags}
          onCreateAnnotation={onCreateAnnotation}
        >
          {convertObjectToReact(child)}
        </Annotator>
      ))
    }
  </div>
)

export function Annotate (
  {
    question,
    answer,
    annotations,
    tags,
    onCreateAnnotation
  }
) {
  return (
    <div className='container mt-4'>
      <div className='row'>
        <aside className='hidden-md-down col-lg-4 flex-last'>
          <LiqenCreator
            question={question}
            answer={answer} />
          <Selector
            annotations={annotations}
            onSelect={(e) => console.log(e) }/>
        </aside>
        <div className='col-lg-8 col-xl-7'>
          <main className='article-body'>
            <EncapsulatedArticle
              tags={tags}
              onCreateAnnotation={onCreateAnnotation} />
          </main>
        </div>
      </div>
    </div>
  )
}

const mapStateToAnswer = (state) => {
  const questionAnswer = state.question.answer.map(
    ({tag, required}) => ({
      tag: state.tags[tag].title,
      required
    })
  )

  const liqenAnswer = state.newLiqen.answer.map(
    a => state.annotations[a] || null
  )

  const zipper = (qa, la) => ({
    title: qa.tag,
    exact: (la && la.target && la.target.exact) || ''
  })
  return zipWith(zipper, questionAnswer, liqenAnswer)
}

const mapStateToAnnotations = (state) => {
  const ret = []

  for (let ref in state.annotations) {
    const {tag, checked, pending, target} = state.annotations[ref]

    ret.push({
      tag: state.tags[tag].title,
      ref,
      target,
      checked,
      pending
    })
  }

  return ret
}

const mapStateToProps = (state) => ({
  question: state.question.title,
  answer: mapStateToAnswer(state),
  annotations: mapStateToAnnotations(state),
  tags: state.question.answer.map(
    ({tag}) => ({ref: tag, title: state.tags[tag].title})
  )
})
const mapDispatchToProps = (dispatch) => ({
  onCreateAnnotation: ({target, tag}) => dispatch(createAnnotation(target, tag))
})

export default connect(mapStateToProps, mapDispatchToProps)(Annotate)
