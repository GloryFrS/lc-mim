import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Card from './Card'

const Cards = () => (
    <Switch>
      <Route path="/card/:id"  component={Card}/>
    </Switch>
  )

export default Cards; 