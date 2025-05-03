'use server'

import { UIFieldServerComponent, UIFieldServerProps } from 'payload'
import { AButton } from './AButton'

const CustomServerButton: UIFieldServerComponent = async (props: UIFieldServerProps) => {
  const { siblingData } = props
  //siblingData.content
  //siblingData.sendto[0]

  return (
    <div>
      <AButton
        content={siblingData.content}
        send_to={siblingData.send_to}
        noti_id={siblingData.id}
      />
    </div>
  )
}

export default CustomServerButton
