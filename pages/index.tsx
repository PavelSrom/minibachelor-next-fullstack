import { NextPage } from 'next'
import Image from 'next/image'
import clsx from 'clsx'
import { Container } from '@material-ui/core'
import { Button, Text } from '../styleguide'

const featureTexts = [
  'Share your projects and get feedback',
  'Ask questions and get help',
  'Get inspiration from other projects',
  'Get an overview over your projects',
]

const HomePage: NextPage = () => {
  return (
    <>
      <header className="h-16 bg-theme-secondary text-white text-center p-4">
        <Text variant="h2">New features coming up soon, register and stay tuned!</Text>
      </header>

      <section className="bg-white">
        <nav className="px-12 space-x-6 pt-8 flex justify-end">
          <Button variant="text" href="/">
            Home
          </Button>
          <Button variant="text" component="a" href="#features">
            Features
          </Button>
          <Button variant="text" href="/register">
            Register
          </Button>
          <Button variant="text" href="/login">
            Login
          </Button>
        </nav>

        <div className="text-center mt-24 space-y-4">
          <Text variant="h2" className="text-3xl">
            School made easy
          </Text>
          <Text variant="h1" className="text-5xl">
            A safe community
            <br />
            for students and teachers
          </Text>
          <Text variant="body" className="text-2xl">
            Our platform creates a shared space where students
            <br /> can share ideas, projects and much more
          </Text>
        </div>

        <img
          src="/images/home_banner.svg"
          alt="home_banner.svg"
          className="max-w-full h-auto mx-auto mt-16"
        />
      </section>

      <Container
        component="section"
        maxWidth="lg"
        className="py-16 flex flex-col"
        id="features"
      >
        <Text variant="h1" className="text-center text-5xl mb-16">
          Features
        </Text>

        {featureTexts.map((text, index) => (
          <div
            key={index}
            className={clsx('w-1/2 flex justify-center', {
              'self-end': index % 2 === 1,
            })}
          >
            <div>
              <Text className="text-2xl mb-6">{text}</Text>
              <img
                src={`/images/home${index + 1}.svg`}
                alt={`home${index + 1}.svg`}
                className="max-w-xs h-auto"
              />
            </div>
          </div>
        ))}
      </Container>
      <img
        src="/images/home_bottom.svg"
        alt="home_bottom.svg"
        className="max-w-full h-auto mx-auto mt-16"
      />

      <footer className="h-12 flex justify-center items-center bg-gray-700">
        <Text className="text-white">
          Copyright &copy;2021 Pavel Srom, Nicoleta Olaru, Jonas Sørensen
        </Text>
      </footer>
    </>
  )
}

export default HomePage
