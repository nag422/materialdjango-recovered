import React from 'react'
import axios from 'axios';
import '../../assets/css/pricing.css'
import { NavLink } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Button } from '@material-ui/core';
import { loadStripe } from "@stripe/stripe-js";




const stripePromise = loadStripe("pk_test_51H2GwkFM3Q6O7DuK3XgFpJhO5snlKligZL0EKLRoyynRKVIfxsPFyN0Z9KPxZmmmYJCwJY7MbnzqKgRybQpiZz7000KK2MEv5c");
const Pricing = () => {
const [pricedetails,setPricedetails] = React.useState([]);
const [isloading,setIsloading]=React.useState(false)
const [tier,setTier] = React.useState(1)
const [country,setCountry] = React.useState('IN')
const [priceinusd,setPriceinusd] = React.useState({
    country:'',
    exchangerateinusd:1,
    isfetched:false
})

const fetchpayment = async () => {
    setIsloading(true)
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
        await axios.get('https://app.kiranvoleti.com/paymentrates/', config).then(res=>{
            setPricedetails(res.data.response)
            setIsloading(false)
            if(localStorage.getItem('tier') !== ""){
                setTier(localStorage.getItem('tier'))
             }
        })

    } catch (err) {
        console.log(err)
        setIsloading(false)
       
    }
}

React.useEffect(() => {
    
  fetchpayment();
}, [])

const createCheckoutSession = async (tierval,priceId)=> {
    const config = {
        
      
            headers: {
              "Content-Type": "application/json",
              'Authorization': `JWT ${localStorage.getItem('access')}`,
            }          
          

    }
    const form_data = new FormData();
    form_data.append('priceid',priceId)
    form_data.append('tier',tierval)
    return await axios.post("https://app.kiranvoleti.com/createcheckoutsession/",form_data, config).then(function(result) {
      return result;
    });
  };


const checkoutnow = async (e,tierval,priceid) => {
    e.preventDefault();
    
    const stripe = await stripePromise;
    await createCheckoutSession(tierval,priceid).then((res) => {
      // Call Stripe.js method to redirect to the new Checkout page
      // (data.sessionId)
      
      localStorage.setItem('pricesession',res.data.sessionId)
      stripe
        .redirectToCheckout({
          sessionId: res.data.sessionId
        })
        .then(res=> {
          console.log(res.data)
          console.log('is success')
        });
      
    }).catch(err=>{
      console.log(err.message)
    })

}
// React.useEffect(() => {
//     setPriceinusd({
//         ...priceinusd,
//         isfetched:true
//     })
//    axios.get('https://app.kiranvoleti.com/ui/admin/getexchangerate/?code='+(country)).then(res=> {
       
//     setPriceinusd({
//         ...priceinusd,
//         country:res.data.response[0]['country'],
//         exchangerateinusd:res.data.response[0]['exchangerateinusd'],
//         isfetched:false        
        
//         })
       
//    })
//   }, [country])

   
    return (
<>
{isloading && <LinearProgress color="secondary" />}


        <header className="headerstyle">
        <NavLink to='/profile'><button className="backbutton">&larr;Home</button></NavLink>
        </header>
        <div className="root">
            <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between" mt={1}>
            <Button variant="contained" color={country === "IN"? "primary":"default"} onClick={()=> setCountry("IN")} style={{borderRadius:0}}>
        INR
        </Button>
        <Button variant="contained" color={country === "US"? "primary":"default"} onClick={()=> setCountry("US")} style={{borderRadius:0}}>
        USD
        </Button>

            </Box>
        
        <div className="pricing-table">            
       
        
        {pricedetails.map((val,index)=>{
            return  <div className="pricing-card" key={val.id}>
            <h3 className="pricing-card-header">Tier{index+1}</h3>
            <div className="price">{country==="IN"? <sup>&#8377;</sup>:<sup>&#x24;</sup>}{country ==="US"?(val.usdprice):val.price}<span>{+val.validity * 30  >= 360 ? '/Yr':'/Mo' }</span></div>
            <ul>
            <li><strong>{val.services}</strong></li>
            <li><strong>{+val.validity * 30  >= 360 ? '1/Year':val.validity+'/Months' }</strong></li>
            </ul>
            {tier === val.tier ? <button className="order-btn">Current Plan</button>:
            val.tier === '1' && +tier > 1 ?
            null:<button className="order-btn2" onClick={(e)=>checkoutnow(e,val.tier,country==="IN"?val.priceid:val.usdpriceid)}>Checkout</button>
            }
        </div>
        }
        
        
        )}

            
             {/* <div className="pricing-card">
                <h3 className="pricing-card-header">Tier2</h3>
                <div className="price"><sup>$</sup>{pricedetails.tier1.price}<span>/Yr</span></div>
                <ul>
                <li><strong>{pricedetails.tier2.services}</strong></li>
                <li><strong>{pricedetails.tier2.price} Year</strong></li>
                </ul>
                
                <NavLink to={{
                        pathname: "/checkout",
                        search: "?tier=2",
                    }} className="order-btn">Order Now</NavLink>
            </div> */}
            {/*<div className="pricing-card">
                <h3 className="pricing-card-header">Tier3</h3>
                <div className="price"><sup>$</sup>{pricedetails.tier3.price}<span>/Yr</span></div>
                <ul>
                <li><strong>{pricedetails.tier3.services}</strong></li>
                <li><strong>{pricedetails.tier3.price} Year</strong></li>
                </ul>
                <NavLink to={{
                        pathname: "/checkout",
                        search: "?tier=3",
                    }} className="order-btn">Order Now</NavLink>
                
            </div>  */}

            </div>
            </div>
            </>
    )
}

export default Pricing
