import React from 'react';

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,

} from "@stripe/react-stripe-js";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import axios from "axios";
import CheckoutForm from './checkoutform';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, Input, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
// you should use env variables here to not commit this
// but it is a public key anyway, so not as sensitive

const stripePromise = loadStripe("pk_test_51H2GwkFM3Q6O7DuK3XgFpJhO5snlKligZL0EKLRoyynRKVIfxsPFyN0Z9KPxZmmmYJCwJY7MbnzqKgRybQpiZz7000KK2MEv5c");


const Index = () => {
  const [status, setStatus] = React.useState("ready");
  const [discount, setDiscount] = React.useState('');
  const [discountprice, setDiscountprice] = React.useState(0);
  const [isvalid, setIsvalid] = React.useState(false);
  let history = useHistory();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const inr = params.get('inr');
  const tier = params.get('tier');
  const currency = params.get('currency');
  const code = params.get('code');
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
        window.location.replace("/articles")
      })

  }

  const createCheckoutSession = (priceId)=> {
    return fetch("https://app.kiranvoleti.com/createcheckoutsession/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        priceId: priceId
      })
    }).then(function(result) {
      return result.json();
    });
  };

  const checkout = async () => {
    const stripe = await stripePromise;
    await createCheckoutSession("price_1J00jBFM3Q6O7DuKkXlcCRZI").then((data) => {
      // Call Stripe.js method to redirect to the new Checkout page
      // (data.sessionId)
      localStorage.setItem('priceid',data.sessionId)
      stripe
        .redirectToCheckout({
          sessionId: data.sessionId
        })
        .then(res=> {
          console.log(res.data)
          console.log('is success')
        });
      
    }).catch(err=>{
      console.log(err.message)
    })

  }

  


  React.useEffect(() => {
    const config = {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json'
      }
  };
    axios.get("https://app.kiranvoleti.com/ui/admin/retdiscper/?code="+(discount),config)
    .then(res=> {
      if (+res.data.status === 200 ){
        setDiscountprice(res.data.discount)
        setIsvalid(true)
      }else{
        setDiscountprice(0)
        setIsvalid(false)
      }
      
        
    })
    .catch(err=> {
      setIsvalid(false)
    })
    
  }, [discount])




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
                    discountcode ={discount}
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
                  <Typography variant="p" component="p">Price</Typography>
                  <Typography variant="p" component="p">{currency === "US"? 'USD'+(+inr/code).toFixed(2):'INR'+ inr+'.00'}</Typography>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Typography variant="p" component="p">Plan</Typography>
                  <Typography variant="p" component="p">Tier {tier}</Typography>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Typography variant="p" component="p">Tax</Typography>
                  <Typography variant="p" component="p">0.00(0%)</Typography>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Box display="flex" flexDirection="row">
                    <Typography variant="p" component="p">Discount:</Typography>
                   {isvalid && 
                   <>
                    <CheckCircleIcon color="primary" fontSize="small" />
                    <Typography variant="p" component="p">coupon is applied</Typography>
                   </>
                   }
                    
                    
                    
                  </Box>
                  <Box display="flex" flexDirection="row">
                  
                  <input type="text" onChange={(e)=>setDiscount(e.target.value)} /> &nbsp;
                  
                  </Box>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" p={3}>
                  <Typography variant="h6" component="p">Total</Typography>
                  {discountprice > 0? 
                  <Typography variant="h5" component="p">{currency === "US"? 'USD '+ ((+inr - ((+inr*discountprice)/100)  )/code).toFixed(2) :'INR '+ (+inr - ((+inr*discountprice)/100)  ).toFixed(2)}</Typography>
                  :
                  <Typography variant="h5" component="p">{currency === "US"? 'USD '+(+inr/code).toFixed(2):'INR '+ inr}</Typography>
                  }
                </Box>
                <Divider />

              </Box>
              <Box style={{padding:'30px',float:'right'}}>
          <NavLink to="/pricing"> &larr;Back </NavLink>
        </Box>
            </Card>
          </Grid>
          <button onClick={checkout}>Subscribe</button>
        </Grid>
      </Container>
    </>
// https://app.kiranvoleti.com/thanks?session_id=cs_test_a13vgD4d4miJKQM8qinqGJ4eGo0PwpNdIbjurFDNlf0j0ea0vazWqoIYci
// session_id=cs_test_a1xKdZuB1mtosBHfVO9dQ2E21Oa5dAvOBWXtuiLGe8kWvLAxdH7kFyAgz6

  );
};

export default Index;