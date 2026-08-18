import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import './Home.css';

import Hero from '../../components/Client/Hero/Hero';
import TechStackSection from '../../components/Client/TechStack/TechStackSection';
import StatsSection from '../../components/Client/Stats/StatsSection';
import ProjectsSection from '../../components/Client/Projects/ProjectsSection';
import TimelineLabsSection from '../../components/Client/Experience/TimelineLabsSection';
import PostsSection from '../../components/Client/Posts/PostsSection';
import ContactSection from '../../components/Client/Contact/ContactSection';

const Home = () => {
    const [data, setData] = useState({
        profile: null,
        socialLinks: [],
        technologies: [],
        projects: [],
        experiences: [],
        posts: [],
        labs: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all endpoints concurrently using Promise.allSettled
                const results = await Promise.allSettled([
                    api.get('/profile'),
                    api.get('/social_links'),
                    api.get('/technologies'),
                    api.get('/projects'),
                    api.get('/experiences'),
                    api.get('/posts'),
                    api.get('/labs')
                ]);

                const extractData = (result) => result.status === 'fulfilled' ? result.value.data.metadata : null;
                const profileData = extractData(results[0]);

                setData({
                    profile: Array.isArray(profileData) ? profileData[0] : profileData,
                    socialLinks: extractData(results[1]) || [],
                    technologies: extractData(results[2]) || [],
                    projects: extractData(results[3]) || [],
                    experiences: extractData(results[4]) || [],
                    posts: extractData(results[5]) || [],
                    labs: extractData(results[6]) || []
                });
            } catch (error) {
                console.error("Error fetching portfolio data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        if (loading) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [loading]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading Developer Showcase...</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="reveal">
                <Hero profile={data.profile} socialLinks={data.socialLinks} />
            </div>

            <div className="reveal">
                <TechStackSection technologies={data.technologies} />
            </div>

            <div className="reveal">
                <StatsSection
                    projectsCount={data.projects?.length || 0}
                    techCount={data.technologies?.length || 0}
                    experiences={data.experiences}
                />
            </div>

            <div className="reveal">
                <ProjectsSection projects={data.projects} />
            </div>

            <div className="reveal">
                <TimelineLabsSection experiences={data.experiences} labs={data.labs} />
            </div>

            <div className="reveal">
                <PostsSection posts={data.posts} />
            </div>

            <div className="reveal">
                <ContactSection profile={data.profile} />
            </div>
        </div>
    );
};

export default Home;
