"use client"

import Link from "next/link"
import { ArrowUpRight, Github, Globe, Music, Gamepad2, UtensilsCrossed, Music2, Disc3 } from "lucide-react"
import { ConfettiButton } from "@/components/confetti-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { AnimatedSection, StaggeredChildren } from "@/components/animations"
import { useInView } from "react-intersection-observer"
import { ScrollProgress } from "@/components/scroll-progress"
import { TravelMarquee } from "@/components/travel-marquee"

export default function Home() {
  const [headerRef, headerInView] = useInView({ triggerOnce: true })
  const [introRef, introInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <ScrollProgress />
      <header className="border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            ref={headerRef}
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xl font-medium"
          ></motion.h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <motion.section
          ref={introRef}
          initial={{ opacity: 0, y: 20 }}
          animate={introInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold mb-6">hi, i'm Kartik.</h2>

          <p className="mb-6">
            Building & Breaking @{" "}
            <Link
              href="https://quillbot.com"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              QuillBot
            </Link>{" "}
            {"& Gym"}
          </p>

          <p className="mb-6">
            Built Rezonance, an ad free music streaming{" "}
            <Link
              href="https://github.com/rezonance-india/app"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              mobile app
            </Link>{" "}
            intiially which scaled to 2k+ users using the app. Then, built{" "}
            <Link
              href="https://listen.rezonance.in"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              webapp
            </Link>{" "}
            for the same.
          </p>

          <p className="mb-6">
            Also gave talks, mentored studens in the field of full stack dev @Manipal University Jaipur.
          </p>

          <p className="mb-6">7x Hackathon Winner</p>

          <p className="mb-6">
            Like to play{" "}
            <Link
              href="https://www.chess.com/member/kg-kartik"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              chess
            </Link>
            .
          </p>

          <div className="mb-10">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-4">SONGS I LOVE:</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Disc3 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="https://listen.rezonance.in/search/zehnaseeb"
                    className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
                  >
                    Zehnaseeb
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Music2 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="https://listen.rezonance.in/album/eccbe04ab1f9d0de1fca3be3beb1382e"
                    className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
                  >
                    Heeriye
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-6"
          >
            <Link
              href="https://x.com/kg_kartik20"
              className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
            >
              X <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
            <Link
              href="https://github.com/kg-kartik/"
              className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
            >
              GitHub <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/kg-kartik/"
              className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
            >
              LinkedIn <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
            <Link href="/blog" className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
              Blog
              <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </motion.div>
        </motion.section>

        {/* Travel Marquee Section */}

        {/* <AnimatedSection className="mb-24" delay={0.05}>
          <h2 className="text-2xl font-bold mb-8 border-b border-gray-100 dark:border-gray-800 pb-2">wanderlust</h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            Capturing moments from around the world. Each journey tells a story, each destination leaves a mark.
          </motion.p>
          <TravelMarquee />
        </AnimatedSection>
        */}

        <AnimatedSection className="mb-24" delay={0.1}>
          <h2 className="text-2xl font-bold mb-8 border-b border-gray-100 dark:border-gray-800 pb-2">work</h2>

          <StaggeredChildren staggerDelay={0.15} className="space-y-8">
            <div>
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <div className="text-green-600 dark:text-green-400 font-bold text-lg">Q</div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">QuillBot</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">FullStack Developer</p>
                </div>
              </div>

              <ul className="space-y-3 ml-16">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    Developed a text-to-speech service that adapts to the consuming microfrontend's preferences,
                    dynamically routing requests to the appropriate speech synthesis backend.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    Built a scalable mobile-focused microfrontend library for our Hero tool, Paraphraser, by adapting
                    desktop components and enhancing UI/UX for use across views like the app and Word extension.
                  </span>
                </li>
              </ul>
            </div>
          </StaggeredChildren>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <h2 className="text-2xl font-bold mb-8 border-b border-gray-100 dark:border-gray-800 pb-2">achievements</h2>

          <StaggeredChildren staggerDelay={0.15} className="space-y-8">
            <ConfettiButton>
              <div className="group">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-amber-500 mt-1">🏆</div>
                  <div>
                    <h3 className="text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      Runner up in Linode x Hashnode Hackathon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We designed and built a platform as a service (PaaS) tool that allow users to deploy their
                      applications to Linode in 3 easy steps, removing the hassle of manually setting up a Linux VM and
                      setting up a reverse-proxy server
                    </p>
                  </div>
                </div>
              </div>
            </ConfettiButton>

            <ConfettiButton>
              <div className="group">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-blue-500 mt-1">🏆</div>
                  <div>
                    <h3 className="text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      Honourable Mention in Build the World with Dolby.io Hackathon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We built Obsidian, a platform for streamlining classroom experience using Dolby's communication
                      APIs by providing features ranging from plagiarism detection in handwritten assignments to
                      automatic class notes generation from recorded video conferences.
                    </p>
                  </div>
                </div>
              </div>
            </ConfettiButton>

            <ConfettiButton>
              <div className="group">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-green-500 mt-1">🏆</div>
                  <div>
                    <h3 className="text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Google Code in 2017 Finalist
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Contributed in various open source tasks in Drupal organisation.
                    </p>
                  </div>
                </div>
              </div>
            </ConfettiButton>

            <ConfettiButton>
              <div className="group">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-purple-500 mt-1">🏆</div>
                  <div>
                    <h3 className="text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      CERN Beamline for Schools Global Level Finalist
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Researched and proposed an idea to compute signals from the photomultiplier tubes as a function of
                      the momentum of particles using sequential models.
                    </p>
                  </div>
                </div>
              </div>
            </ConfettiButton>
          </StaggeredChildren>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-2xl font-bold mb-8 border-b border-gray-100 dark:border-gray-800 pb-2">projects</h2>

          <StaggeredChildren staggerDelay={0.15} className="space-y-8">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Link
                      href="https://listen.rezonance.in"
                      className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Rezonance
                    </Link>
                    <ArrowUpRight className="w-4 h-4 text-purple-500" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    An ad free music streaming application with in house music recommendation
                  </p>
                  <div className="flex gap-4 text-xs">
                    <Link
                      href="https://github.com/rezonance-india/app"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 mr-1.5" /> GitHub
                    </Link>
                    <Link
                      href="https://listen.rezonance.in"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 mr-1.5" /> Website
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Link
                      href="https://enchanted.pics"
                      className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      Ghiblify
                    </Link>
                    <ArrowUpRight className="w-4 h-4 text-orange-500" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                   Reverse engineered Open AI's image gen api on a weekend to generate ghibli images at the time they were trending and image gen API was not publicly out. Got some happy users :D
                  (The generation wont work now due to service being stopped)
                  </p>

                  <div className="flex gap-4 text-xs">  
                    <Link
                      href="https://enchanted.pics/"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 mr-1.5" /> Website
                    </Link>

                    <Link
                      href="#"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 mr-1.5" /> Blog (coming soon)
                    </Link>
                    
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Link
                      href="https://cryptx.vercel.app/"
                      className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      Cryptx
                    </Link>
                    <ArrowUpRight className="w-4 h-4 text-orange-500" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    A cryptic hunt where users find the answer as fast as possible to stay on top of the leaderboard.
                    Played by 300+ users (Received around 100k+ requests over a 2 day time period).
                  </p>
                  <div className="flex gap-4 text-xs">
                    <Link
                      href="https://github.com/kg-kartik/cryptx"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 mr-1.5" /> GitHub
                    </Link>
                    <Link
                      href="https://cryptx.vercel.app/"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 mr-1.5" /> Website
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Link
                      href="https://github.com/amanjagdev/salyd"
                      className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      Salyd
                    </Link>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Brings a flawless contactless dinning experience, where the customers coming to the restaurant can
                    scan the qr code and get the menu on their respective screens.
                  </p>
                  <div className="flex gap-4 text-xs">
                    <Link
                      href="https://github.com/amanjagdev/salyd"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 mr-1.5" /> GitHub
                    </Link>
                    <Link
                      href="https://salyd.vercel.app"
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 mr-1.5" /> Website
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggeredChildren>
        </AnimatedSection>
      </main>
    </div>
  )
}
