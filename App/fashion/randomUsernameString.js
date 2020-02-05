function randomUsernameString() {
    return(new String(`Shopaholic-${Math.round(Math.random()*100)}`))
} 

export default randomUsernameString