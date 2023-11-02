"use client"
import { SocketIndicator } from '@/components/common/Socket-indicator'
import AreaChartContainer from '@/components/common/chart/AreaChartContainer'
import Temperature from '@/components/common/chart/temperature'
import { useModal } from '@/hooks/use-modal-store'
import React, { useCallback, useEffect } from 'react'
// import addNotification, { Notifications } from 'react-push-notification';


type Props = {}


const Page = (props: Props) => {

    // const apiUrl sama dengan url api/sensor dengan params sensor date ?= sehari
    const apiUrl = '/api/sensor?date=sehari'

    const { onOpen } = useModal();


    const TryNotification = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification('example notification', {
                    body: 'This is an example notification',
                    data: {
                        hello: 'world',
                    },
                });
            }
        });
    };

    // const showNotification = () => {
    //     const title = 'Halo';
    //     const options = {
    //         body: 'Ini notifikasi sederhana.',
    //         //   icon: '/path/to/icon.png', // Ganti dengan path ke ikon notifikasi Anda
    //     };

    //     new Notification(title, options);
    // };


    // const sendNotification = () => {
    //     if ('Notification' in window && Notification.permission === 'granted') {
    //         new Notification('Halo!', {
    //             body: 'Ini notifikasi sederhana.',
    //         });
    //     }
    // }


    // const requestNotificationPermission = useCallback(() => {
    //     if ('notification' in window) {
    //         Notification.requestPermission().then((permission) => {
    //             if (permission === 'granted') {
    //                 sendNotification();
    //             }
    //         });
    //     }
    // }, []);

    // useEffect(() => {
    //     if ('Notification' in window) {
    //         requestNotificationPermission();
    //     }
    // }, [requestNotificationPermission]);

    const data = [
        { x: 'Jan', y: 10 },
        { x: 'Feb', y: 60 },
        { x: 'Mar', y: 15 },
        // Tambahkan data sesuai dengan kebutuhan Anda
        { x: 'Apr', y: 25 },
        { x: 'May', y: 45 },
        { x: 'Jun', y: 30 },
        { x: 'Jul', y: 70 },
        { x: 'Aug', y: 55 },
        { x: 'Sep', y: 40 },
        { x: 'Oct', y: 85 },
        { x: 'Nov', y: 20 },
        { x: 'Dec', y: 75 },
        { x: 'Jan', y: 5 },
        { x: 'Feb', y: 35 },
        { x: 'Mar', y: 45 },
        { x: 'Apr', y: 60 },
        { x: 'May', y: 20 },
        { x: 'Jun', y: 90 },
        { x: 'Jul', y: 15 },
        { x: 'Aug', y: 70 },
        { x: 'Sep', y: 30 },
        { x: 'Oct', y: 80 },
        { x: 'Nov', y: 25 },
        { x: 'Dec', y: 50 },
        { x: 'Jan', y: 10 },
        { x: 'Feb', y: 40 },
        { x: 'Mar', y: 65 },
        { x: 'Apr', y: 30 },
        { x: 'May', y: 70 },
        { x: 'Jun', y: 15 },
        { x: 'Jul', y: 50 },
        { x: 'Aug', y: 20 },
        { x: 'Sep', y: 85 },
        { x: 'Oct', y: 40 },
        // Lanjutkan sampai bulan ke-30
    ];


    return (
        <div className='text-white '>
            page
            {/* <Notifications /> */}

            <SocketIndicator />

            <button onClick={TryNotification}>Trigger Notifikasi</button>

            <button className='text-white' onClick={() => onOpen("createNotif")}>Open Modal</button>

            <AreaChartContainer data={data} size={{ height: 300, width: 500 }} />
            <div className="">
                <div className="mt-10">
                    <Temperature
                        apiUrl={apiUrl}
                    // paramKey="sensorId"
                    // paramValue={""}
                    // socketUrl="/api/socket/dht"
                    // socketQuery={{
                    //     sensorId: "",
                    // }}
                    />
                </div>

            </div>
        </div>
    )
}

export default Page