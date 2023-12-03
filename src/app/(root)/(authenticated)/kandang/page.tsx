
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import KandangComponent from '@/components/shared/Authenticated/Kandang';


const Kandang = async () => {
    // jika tidak ada session maka redirect ke login

    // const kandangData = await getKandang()


    const session = await getServerSession(authOptions)

    // jika session?.user.role = "user" alihakan ke path /
    if (session?.user.role !== "owner" && session?.user.role !== "pekerja") {
        redirect('/')
    }


    return (
        <>
            <KandangComponent />
        </ >

    );
};

export default Kandang;


// interface Kandang {
//     id_kandang: string,
//     nama_kandang?: string,
//     gambar_kandang?: string,
// }
