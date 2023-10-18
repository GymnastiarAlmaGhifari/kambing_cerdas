import { SocketIndicator } from '@/components/common/Socket-indicator'
import Temperature from '@/components/common/chart/temperature'
import React from 'react'

type Props = {}

const Page = (props: Props) => {

    // const apiUrl sama dengan url api/sensor dengan params sensor date ?= sehari
    const apiUrl = '/api/sensor?date=sehari'

    return (
        <div className='text-white '>page
            <SocketIndicator />

            <div className="">
                <div className="mt-10">
                    <Temperature
                        apiUrl={apiUrl}
                        paramKey="sensorId"
                        paramValue={""}
                        socketUrl="/api/socket/sensor"
                        socketQuery={{
                            sensorId: "",
                        }}
                    />
                </div>

            </div>
        </div>
    )
}

export default Page