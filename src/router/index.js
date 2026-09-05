// import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Blog from '@/views/Blog.vue';
import BlogDetails from '@/views/BlogDetails.vue';
import Contact from '@/views/Contact.vue';
import Confirmation from '@/views/Confirmation.vue';
import EditorAccount from '@/views/Editor/EditorAccount.vue';
import EditorDashboard from '@/views/Editor/EditorDashboard.vue';
import GetInvolved from '@/views/GetInvolved.vue';
import NewsAdvocacy from '@/views/NewsAdvocacy.vue';
import Programs from '@/views/Programs.vue';
import Payment from '@/views/Payment.vue';
import Resources from '@/views/Resources.vue';
import RegisterEvents from '@/views/RegisterEvents.vue';
import Conference from '@/views/Conference.vue';
import EditorPages from '@/views/Editor/EditorPages.vue';
import Signin from '@/views/Editor/Signin.vue';
import Membership from '@/views/Membership.vue';
import Interests from '@/views/RegistrationSignIn/Interests.vue';
import Register from '@/views/RegistrationSignIn/Register.vue';
import SignIn from '@/views/RegistrationSignIn/SignIn.vue';
import SigninVerification from '@/views/RegistrationSignIn/SigninVerification.vue';

import SuperAdminAccount from '@/views/SuperAdmin/SuperAdminAccount.vue';
import SuperAdminApplications from '@/views/SuperAdmin/SuperAdminApplications.vue';
import SuperAdminCourseList from '@/views/SuperAdmin/SuperAdminCourseList.vue';
import SuperAdminCreateCourse from '@/views/SuperAdmin/SuperAdminCreateCourse.vue';
import SuperAdminDashboard from '@/views/SuperAdmin/SuperAdminDashboard.vue';
import SuperAdminEventsNewsletter from '@/views/SuperAdmin/SuperAdminEventsNewsletter.vue';
import SuperAdminManager from '@/views/SuperAdmin/SuperAdminManager.vue';
import SuperAdminMembers from '@/views/SuperAdmin/SuperAdminMembers.vue';
import SuperAdminMessages from '@/views/SuperAdmin/SuperAdminMessages.vue';
import SuperAdminPayments from '@/views/SuperAdmin/SuperAdminPayments.vue';

import TutorCourseList from '@/views/Tutor/TutorCourseList.vue';
import TutorCreateCourse from '@/views/Tutor/TutorCreateCourse.vue';
import TutorDashboard from '@/views/Tutor/TutorDashboard.vue';
import TutorReviews from '@/views/Tutor/TutorReviews.vue';

import LearnerCourseDetails from '@/views/Learner/LearnerCourseDetails.vue';
import LearnerSupport from '@/views/Learner/LearnerSupport.vue';
import ArticleDetail from '@/views/User/ArticleDetail.vue';
import CourseDetails from '@/views/User/CourseDetails.vue';
import UserCourseDetails from '@/views/User/CourseDetails.vue';
import MessageNotification from '@/views/User/MessageNotification.vue';
import MyAccount from '@/views/User/MyAccount.vue';
import MyLearning from '@/views/User/MyLearning.vue';
import Support from '@/views/User/Support.vue';
import UserCourses from '@/views/User/UserCourses.vue';
import UserDashboard from '@/views/User/UserDashboard.vue';
import UserSubscription from '@/views/User/UserSubscription.vue';

import Publications from '@/views/Publications.vue';

import AdminAccount from '@/views/Admin/AdminAccount.vue';
import AdminApplications from '@/views/Admin/AdminApplications.vue';
import AdminCourseList from '@/views/Admin/AdminCourseList.vue';
import AdminCreateCourse from '@/views/Admin/AdminCreateCourse.vue';
import AdminDashboard from '@/views/Admin/AdminDashboard.vue';
import AdminEventNewsletter from '@/views/Admin/AdminEventNewsletter.vue';
import AdminManager from '@/views/Admin/AdminManager.vue';
import AdminMembers from '@/views/Admin/AdminMembers.vue';
import AdminMessages from '@/views/Admin/AdminMessages.vue';
import AdminPayments from '@/views/Admin/AdminPayments.vue';
import Events from '@/views/Events.vue';
import Gallery from '@/views/Gallery.vue';
import LearnerMyAccount from '@/views/Learner/LearnerMyAccount.vue';
import LearnerUserCourses from '@/views/Learner/LearnerUserCourses.vue';
import LearnerUserSubscription from '@/views/Learner/LearnerUserSubscription.vue';

import MyLearningLearner from '@/views/Learner/MyLearningLearner.vue';
import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/About.vue';
import Homepage from '../views/Homepage.vue';
import GalleryDetail from '@/views/GalleryDetail.vue';
import TeamDetail from '@/views/TeamDetail.vue';
import Governance from '@/views/Governance.vue';
import CustomPage from '@/views/CustomPage.vue';

import Buttons from '@/components/layout/Buttons.vue';
import SuperAdminEditorPages from '@/views/SuperAdmin/SuperAdminEditorPages.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Homepage,
  },
  { path: '/about', name: 'About', component: About },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/membership', name: 'Membership', component: Membership },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/register', name: 'Register', component: Register },
  { path: '/signin', name: 'Signin', component: SignIn },
  { path: '/events', name: 'Events', component: Events },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/governance', name: 'Governance', component: Governance },
  { path: '/publication', name: 'Publications', component: Publications },
  { path: '/confirmation', name: 'Confirmation', component: Confirmation },
  { path: '/registration-payment', name: 'Payment', component: Payment },
  {
    path: '/events/:slug/register-events',
    name: 'RegisterEvents',
    component: RegisterEvents,
  },
  { path: '/conference', name: 'Conference', component: Conference },

  { path: '/get-involved', name: 'GetInvolved', component: GetInvolved },
  { path: '/programs', name: 'Programs', component: Programs },
  { path: '/news', name: 'NewsAdvocacy', component: NewsAdvocacy },
  { path: '/buttons', name: 'Buttons', component: Buttons },
  { path: '/resources', name: 'Resources', component: Resources },

  {
    path: '/blog/:slug',
    name: 'BlogDetails',
    component: BlogDetails,
    props: true,
  },
  {
    path: '/team/:slug',
    name: 'TeamDetail',
    component: TeamDetail,
    props: true,
  },
  {
    path: '/gallery/:slug',
    name: 'GalleryDetail',
    component: GalleryDetail,
    props: true,
  },
  {
    path: '/signinverification',
    name: 'SigninVerification',
    component: SigninVerification,
  },
  {
    path: '/user/messages',
    name: 'UserMessage',
    component: MessageNotification,
  },
  {
    path: '/user/mylearning',
    name: 'MyLearning',
    component: MyLearning,
  },
  {
    path: '/user/dashboard',
    name: 'UserDasboard',
    component: UserDashboard,
  },
  {
    path: '/user/courses',
    name: 'UserCourses',
    component: UserCourses,
  },
  {
    path: '/course/:id',
    name: 'CourseDetails',
    component: CourseDetails,
  },
  {
    path: '/user/courses/:slug',
    name: 'UserCourseDetails',
    component: CourseDetails,
  },
  {
    path: '/news/:slug',
    name: 'ArticleDetail',
    component: ArticleDetail,
  },
  {
    path: '/user/account',
    name: 'UserAccount',
    component: MyAccount,
  },
  {
    path: '/user/support',
    name: 'UserSupport',
    component: Support,
  },
  {
    path: '/user/subscription',
    name: 'UserSubscription',
    component: UserSubscription,
  },
  {
    path: '/user/interests',
    name: 'Interest',
    component: Interests,
  },

  //editor
  {
    path: '/editor/signin',
    name: 'EditorSignin',
    component: Signin,
  },
  {
    path: '/editor/dashboard',
    name: 'EditorDashboard',
    component: EditorDashboard,
  },
  {
    path: '/editor/pages',
    name: 'EditorPages',
    component: EditorPages,
  },
  {
    path: '/editor/account',
    name: 'EditorAccount',
    component: EditorAccount,
  },

  //tutor
  {
    path: '/tutor/mycourses',
    name: 'TutorCourseList',
    component: TutorCourseList,
  },
  {
    path: '/tutor/create-course',
    name: 'TutorCreateCourse',
    component: TutorCreateCourse,
  },

  {
    path: '/tutor/courses/:slug/edit',
    name: 'TutorEditCourse',
    component: TutorCreateCourse,
    props: (route) => ({ slug: route.params.slug, mode: 'edit' }),
  },

  {
    path: '/tutor/courses/:slug/view',
    name: 'PreviewCourse',
    component: TutorCreateCourse,
    props: (route) => ({ slug: route.params.slug, mode: 'view' }),
  },

  {
    path: '/tutor/dashboard',
    name: 'TutorDashboard',
    component: TutorDashboard,
  },
  {
    path: '/tutor/reviews',
    name: 'TutorReviews',
    component: TutorReviews,
  },

  //superadmin
  {
    path: '/superadmin/dashboard',
    name: 'SuperAdminDashboard',
    component: SuperAdminDashboard,
  },
  {
    path: '/superadmin/courses',
    name: 'SuperAdminCourseList',
    component: SuperAdminCourseList,
  },
  {
    path: '/superadmin/applications',
    name: 'SuperAdminApplications',
    component: SuperAdminApplications,
  },
  {
    path: '/superadmin/create-course',
    name: 'SuperAdminCreateCourse',
    component: SuperAdminCreateCourse,
    props: { mode: 'create' },
  },
  {
    path: '/superadmin/courses/:slug/edit',
    name: 'SuperAdminEditCourse',
    component: SuperAdminCreateCourse,
    props: { mode: 'edit' },
  },
  {
    path: '/superadmin/courses/:slug/view',
    name: 'SuperAdminViewCourse',
    component: SuperAdminCreateCourse,
    props: { mode: 'view' },
  },
  {
    path: '/superadmin/members',
    name: 'SuperAdminMembers',
    component: SuperAdminMembers,
  },
  {
    path: '/superadmin/account',
    name: 'SuperAdminAccount',
    component: SuperAdminAccount,
  },
  {
    path: '/superadmin/access',
    name: 'SuperAdminManager',
    component: SuperAdminManager,
  },
  {
    path: '/superadmin/pages',
    name: 'SuperAdminEditorPages',
    component: SuperAdminEditorPages,
  },
  {
    path: '/superadmin/payments',
    name: 'SuperAdminPayments',
    component: SuperAdminPayments,
  },
  {
    path: '/superadmin/messages',
    name: 'SuperAdminMessages',
    component: SuperAdminMessages,
  },
  {
    path: '/superadmin/events',
    name: 'SuperAdminEventsNewsletter',
    component: SuperAdminEventsNewsletter,
  },

  //For Admin
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/admin/courses',
    name: 'AdminCourseList',
    component: AdminCourseList,
  },
  {
    path: '/admin/applications',
    name: 'AdminApplications',
    component: AdminApplications,
  },
  {
    path: '/admin/create-course',
    name: 'AdminCreateCourse',
    component: AdminCreateCourse,
  },

  {
    path: '/admin/account',
    name: 'AdminAccount',
    component: AdminAccount,
  },

  {
    path: '/admin/payments',
    name: 'AdminPayments',
    component: AdminPayments,
  },
  {
    path: '/admin/messages',
    name: 'AdminMessages',
    component: AdminMessages,
  },
  {
    path: '/admin/members',
    name: 'AdminMembers',
    component: AdminMembers,
  },
  {
    path: '/admin/access',
    name: 'AdminManager',
    component: AdminManager,
  },
  {
    path: '/admin/events',
    name: 'AdminEventNewsletter',
    component: AdminEventNewsletter,
  },

  {
    path: '/admin/courses/:slug/edit',
    name: 'AdminEditCourse',
    component: AdminCreateCourse,
    props: (route) => ({ slug: route.params.slug, mode: 'edit' }),
  },

  {
    path: '/admin/courses/:slug/view',
    name: 'AdminViewCourse',
    component: AdminCreateCourse,
    props: (route) => ({ slug: route.params.slug, mode: 'view' }),
  },

  //for learners

  {
    path: '/learner/dashboard',
    name: 'MyLearningLearner',
    component: MyLearningLearner,
  },

  {
    path: '/learner/courses',
    name: 'LearnerCourses',
    component: LearnerUserCourses,
  },
  {
    path: '/learner/subscription',
    name: 'LearnerUserSubscription',
    component: LearnerUserSubscription,
  },
  {
    path: '/course/:id',
    name: 'LearnerCourseDetails',
    component: LearnerCourseDetails,
  },
  {
    path: '/learner/courses/:slug',
    name: 'LearnerCourseDetails',
    component: LearnerCourseDetails,
  },
  {
    path: '/learner/account',
    name: 'LearnerMyAccount',
    component: LearnerMyAccount,
  },
  {
    path: '/learner/support',
    name: 'LearnerSupport',
    component: LearnerSupport,
  },
  {
    path: '/:slug',
    name: 'CustomPage',
    component: CustomPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
