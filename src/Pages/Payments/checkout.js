import React from 'react';

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,

} from "@stripe/react-stripe-js";

import axios from "axios";
import CheckoutForm from './checkoutform';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Container, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

// you should use env variables here to not commit this
// but it is a public key anyway, so not as sensitive
const stripePromise = loadStripe("pk_test_51H2GwkFM3Q6O7DuK3XgFpJhO5snlKligZL0EKLRoyynRKVIfxsPFyN0Z9KPxZmmmYJCwJY7MbnzqKgRybQpiZz7000KK2MEv5c");

const Index = () => {
  const [status, setStatus] = React.useState("ready");
  let history = useHistory();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const inr = params.get('inr');
  const tier = params.get('tier');
  if (inr == 0) {

    const formdata = new FormData();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json'
      }
    };
    axios.post("https://app.kiranvoleti.com/save_stripe_info/", formdata, config)
      .then(res => {
        window.location.replace("/profile")
      })

  }




  if (status === "success") {
    return <div>Congrats on your empanadas!</div>;
  }
  if (!localStorage.getItem('email')) {
    alert('Please Provide an Email')
    window.location.replace('/profile')
  }
  return (

    <>
      <Container>
        <br></br>
        <Grid container
          spacing={2}
        // style={{
        // background: 'linear-gradient(to right, #4286f4, #373B44)'}} spacing={2}

        >
          <Grid item xs={12} md={6}>

            <Card>
              <CardHeader
                title="Payment method"
                subheader="Pay securely"
              >
                <Box component="p">Summary</Box>
              </CardHeader>

              <CardContent>
                <Elements stripe={stripePromise}>

                  <CheckoutForm
                    success={() => {
                      setStatus("success");
                    }}
                  />
                </Elements>
              </CardContent>
            </Card>


          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Summary"

              ></CardHeader>
              <Box display="flex" flexDirection="column" alignContent="left">

                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Typography variant="p" component="p">Tools(Billed Yearly)</Typography>
                  <Typography variant="p" component="p">${inr}.00</Typography>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Typography variant="p" component="p">Plan</Typography>
                  <Typography variant="p" component="p">Tier {tier}</Typography>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Typography variant="p" component="p">Total</Typography>
                  <Typography variant="p" component="p">${inr}.00</Typography>
                </Box>
                <Divider />

              </Box>
              <Box style={{padding:'30px',float:'right'}}>
          <NavLink to="/pricing"> &larr;Back </NavLink>
        </Box>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </>


  );
};

export default Index;