import React, { FC, useEffect } from 'react'
import style from './steps.module.scss'
import clsx from 'clsx'
import Icon from 'components/Icon'
import { useMediaQuery } from 'react-responsive'

interface StepsProps {
  steps: string[]
  current: number
  goBack(): void
}
const Steps: FC<StepsProps> = ({ steps, current, goBack }) => {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const stepBack = (isLessThanCurrent: boolean, current: number) => {
    if (isLessThanCurrent && current !== 0) {
      goBack()
    }
    return
  }
  const [isVisible, setIsVisible] = React.useState<boolean>(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  return (
    <div className={style.container}>
      {current > 1 && (
        <div
          onClick={() => stepBack(true, current)}
          className={style.iconArrow}
        >
          <Icon id="arrow-left" width={27} height={27} />
        </div>
      )}
      <div className={style.wrapper}>
        {steps.map((item, index) => {
          const currentStep = index + 1

          const isLessThanCurrent = current > currentStep
          const activeNumber = isLessThanCurrent ? style.activeNumber : null
          const activeStep = isLessThanCurrent ? style.activeStep : null
          const futureStep = current < currentStep

          {
            return isVisible && !isMobile ? (
              <>
                <div
                  onClick={() => stepBack(isLessThanCurrent, current)}
                  className={clsx(
                    style.step,
                    currentStep === current ? style.activeStep : null,
                    activeStep
                  )}
                  key={index}
                >
                  <div
                    className={clsx(
                      style.number,
                      currentStep === current ? style.activeStep : null,
                      activeNumber,
                      !futureStep && style.currentStep
                    )}
                  >
                    {!currentStep < !isLessThanCurrent ? (
                      index + 1
                    ) : (
                      <Icon
                        className={style.icon}
                        id="active"
                        width={25}
                        height={25}
                      />
                    )}
                  </div>
                  <span style={{fontSize: 14}}>{item}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => stepBack(isLessThanCurrent, current)}
                  className={clsx(style.wrapper_mob, 'light-14')}
                  key={index}
                >
                  <div
                    className={clsx(
                      style.step_mob,
                      currentStep === current || currentStep < current
                        ? style.activeStep_mob
                        : null
                    )}
                  >
                    {!currentStep < isLessThanCurrent && (
                      <Icon
                        className={style.icon}
                        id="active"
                        width={24}
                        height={22}
                      />
                    )}
                    {item}
                  </div>
                </div>
              </>
            )
          }
        })}
      </div>
    </div>
  )
}

export default Steps
