import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import colors from 'colors';
import cn from '@forest-feed/utils/tailwind';

const MySwal = withReactContent(Swal);

export default async function notEnoughBalance(t: any) {
  try {
    await MySwal.fire({
      title: t('sweetalert.notEnoughBalance.title'),
      icon: 'info',
      iconColor: colors.primary,
      buttonsStyling: false,
      customClass: {
        confirmButton: cn('bg-primary text-white focus:outline-none focus:border-none py-2 p-5 rounded-lg text-lg'),
      },
    });
  } catch (e: any) {
    console.log(e, 'error in notEnoughBalance sweetalert2');
  }
}
