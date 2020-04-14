import React from 'react';
import { Route ,Switch } from 'react-router-dom';
import AddReport from "./Products";


const Main = () => (
  <main>
    <Switch>
        <Route path="/add-report" exact component={AddReport} />
        {/* <Route path="/assign-material" exact component={AssignMaterial} />
        <Route path="/assign-doctor" exact component={AssignDoctor} />
        <Route path="/create-group" exact component={CreateGroup} /> */}
    </Switch>
  </main>
)

export default Main