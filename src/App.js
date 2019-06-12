import React from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import User from './User';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

class App extends React.Component{

  state = {
    currentUser: null,
    allFood: [],
  }
  //replace this state with a redux state
  
  componentDidMount(){
  
    fetch('http://localhost:3000/foods')
    .then(response => response.json())
    .then(mealsJSON => {
          this.setState({
             allFood: mealsJSON
         })
    })
    .then(this.fetchUser)
  }
  
  fetchUser = () => {
    if(localStorage.token){
      fetch('http://localhost:3000/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      }).then(res => res.json())
      .then(userData => {
        this.setState({
          currentUser: userData.user
        })
      })
    }
  }

  logOut = () => {
		localStorage.removeItem('token')
		this.setState({
			currentUser: null
		}, () => {
			this.props.history.push("/login")
		})
  }
  
  setCurrentUser = (data) => {
		localStorage.setItem("token", data.jwt)
		this.setState({
			currentUser: data.user
		},() => console.log(this.state.currentUser))
  }
  
  render(){
    console.log(this.state.allFood)
    const currentUserID = this.state.currentUser ? this.state.currentUser.id : null
    return (
      <div>
        <div className='appHeader'>
          <h1>Food Culture</h1>
        </div>

        <div className="topnav">
          <a href="http://localhost:3001/home">Home</a>
          <a href="http://localhost:3001/login">Log In</a>
          {this.state.currentUser ?  <input type='button' value='Logout' onClick={this.logOut}/> : null}
          {this.state.currentUser ?  <Link to={`/users/${currentUserID}`} >Profile</Link> : null}
        </div>

        <div className='loggedInName'>{this.state.currentUser ? <h1>{this.state.currentUser.username}</h1> : null} </div>
        <div className='body'>
          <Switch>
            <Route
              path='/login'
              render={(routerProps) => {
                return <Login {...routerProps} setCurrentUser={this.setCurrentUser}/> 
              }}
            />
            <Route
              path='/signup'
              render={(routerProps) => {
                return <Signup {...routerProps}  setCurrentUser={this.setCurrentUser}/> 
              }}
            />
            <Route 
              path="/users/:id"
              render={(routerProps) => {
                return <User allFood={this.state.allFood} {...routerProps}/>
              }}
            />
            <Route
              path='/home'
              render={(routerProps) => {
                return <Home allFood={this.state.allFood} {...routerProps}/> 
              }}
            />
            <Route render={() => <Redirect to='/home'/> }/>
          </Switch>
        </div>

        <div className='footer'>
          <p>Powered by Swag</p>
        </div>
      </div>
    )
  }
}

// function mapStateToProps(state){
//   // get state
//   return {
//     currentUser: state.currentUser,
//     allFood: state.allFood
//   }
// }

// function mapDispatchToProps(dispatch){
//   //edit states
//   return {
//     setCurrentUser: (user) => {
//       dispatch({type: "SET_CURRENT_USER", payload: user})
//     },
//   }
// }


// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default App



// React 
	// setCurrentUser = (data) => {
	// 	localStorage.setItem("token", data.jwt)
	// 	this.setState({
	// 		currentUser: data.user
	// 	},() => console.log(this.props.currentUser))
	// }
