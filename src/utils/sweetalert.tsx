import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {colors} from 'colors';

const MySwal = withReactContent(Swal);

export async function notEnoughBalance(t: any) {
  try {
    await MySwal.fire({
      title: t('sweetalert.notEnoughBalance.title'),
      icon: 'info',
      iconColor: colors.green,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-green text-white focus:outline-none focus:border-none py-2 px-3 rounded-lg text-lg',
      },
    });
  } catch (e: any) {
    console.log(e, 'error in notEnoughBalance sweetalert2');
  }
}
