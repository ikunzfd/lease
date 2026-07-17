import { useUserStore } from '@/store/modules/user'

export function RESEETSTORE() {
  const userStore = useUserStore()
  userStore.$reset()
}
