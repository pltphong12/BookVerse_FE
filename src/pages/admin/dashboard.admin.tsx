import { setBreadcrumbs } from '../../redux/slide/breadcrumbs.slice'
import { useEffect } from 'react'
import AmountStats from '../../components/admin/dashboard/component/AmountStats'
import DashboardStats from '../../components/admin/dashboard/component/DashboardStats'
import PageStats from '../../components/admin/dashboard/component/PageStats'

// import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
// import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
// import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
// import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
// import UserChannels from './component/UserChannels'
// import LineChart from './components/LineChart'
// import BarChart from './components/BarChart'
// import DashboardTopBar from './components/DashboardTopBar'
// import { useDispatch } from 'react-redux'
// import {showNotification} from '../common/headerSlice'
// import DoughnutChart from './components/DoughnutChart'
// import { useState } from 'react'
import { CircleAlert, CreditCard, UserIcon, Users } from 'lucide-react'
import { clearBreadcrumbs } from '../../redux/slide/breadcrumbs.slice'
import { useAppDispatch } from '../../redux/hook'
import { useLocation } from 'react-router-dom'

const statsData = [
    {title : "New Users", value : "34.7k", icon : <Users className='w-8 h-8'/>, description : "↗︎ 2300 (22%)"},
    {title : "Total Sales", value : "$34,545", icon : <CreditCard className='w-8 h-8'/>, description : "Current month"},
    {title : "Pending Leads", value : "450", icon : <CircleAlert className='w-8 h-8'/>, description : "50 in hot leads"},
    {title : "Active Users", value : "5.6k", icon : <UserIcon className='w-8 h-8'/>, description : "↙ 300 (18%)"},
]



export const DashboardAdmin = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
          { label: "Quản lý", path: "/admin" },
          { label: "Dashboard", path: "/admin" },
        ]));
      }, [dispatch, location.pathname]);

    return(
        <>
        {/** ---------------------- Select Period Content ------------------------- */}
            {/* <HeaderAdmin/> */}
        
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>



        {/** ---------------------- Different charts ------------------------- */}
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div> */}
            
        {/** ---------------------- Different stats content 2 ------------------------- */}
        
            <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div>

        {/** ---------------------- User source channels table  ------------------------- */}
        
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <UserChannels />
                <DoughnutChart />
            </div> */}
        </>
    )
}
