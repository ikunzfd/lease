import { useUserStore } from '@/store/modules/user'

export function RESETSTORE() {
  const userStore = useUserStore()
  userStore.$reset()
}
