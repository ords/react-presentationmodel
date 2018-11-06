import React from 'react'
import { Subscription } from 'rxjs-compat/Subscription'
import { IPresentationModel } from './../PresentationModel'

export type presentationModelProvider<T extends object> = () => IPresentationModel<T>

export interface ViewControllerProps<T extends object> {
  children: (presentationModel: IPresentationModel<T>) => JSX.Element
}
export const createViewController = <T extends object>(presentationModelProvider: presentationModelProvider<T>) => (

  class ViewController extends React.PureComponent<ViewControllerProps<T>> {
    public presentationModel: IPresentationModel<T>
    private stateSubscription?: Subscription
    constructor(props) {
      super(props)
      this.presentationModel = presentationModelProvider()
    }
    public componentDidMount() {
      this.stateSubscription = this.presentationModel!.model!.subscribe((state) => (
        this.setState(state)
      ))
    }
    public componentWillUnmount() {
      if (this.stateSubscription) {
        this.stateSubscription.unsubscribe()
      }
    }
    public render() {
      return this.props.children(this.presentationModel)
    }
  }
)