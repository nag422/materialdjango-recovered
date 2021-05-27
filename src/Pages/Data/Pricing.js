import React from 'react'
import axios from 'axios';
import '../../assets/css/pricing.css'
import { NavLink } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Button } from '@material-ui/core';

const Pricing = () => {
const [pricedetails,setPricedetails] = React.useState([]);
const [isloading,setIsloading]=React.useState(false)
const [tier,setTier] = React.useState(1)
const [country,setCountry] = React.useState('IN')
const [priceinusd,setPriceinusd] = React.useState({
    country:'',
    exchangerateinusd:1
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

React.useEffect(() => {
   axios.get('https://app.kiranvoleti.com/ui/admin/getexchangerate/?code='+(country)).then(res=> {
       
    setPriceinusd({
        ...priceinusd,
        country:res.data.response[0]['country'],
        exchangerateinusd:res.data.response[0]['exchangerateinusd']        
        
        })
       
   })
  }, [country])

   
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
            <div className="price">{country==="IN"? <sup>&#8377;</sup>:<sup>&#x24;</sup>}{country ==="US"?(+val.price/priceinusd.exchangerateinusd).toFixed(2):val.price}<span>{+val.validity * 30  >= 360 ? '/Yr':'/Mo' }</span></div>
            <ul>
            <li><strong>{val.services}</strong></li>
            <li><strong>{+val.validity * 30  >= 360 ? '1/Year':val.validity+'/Months' }</strong></li>
            </ul>
            {tier === val.tier ? <button className="order-btn">Current Plan</button>:
            val.tier === '1' && +tier > 1 ?
            null:<NavLink to={{
                pathname: "/checkout",
                search: `?tier=${val.tier}&inr=${val.price}&currency=${country}&code=${priceinusd.exchangerateinusd}`,
            }} className="order-btn">Order Now</NavLink>
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
