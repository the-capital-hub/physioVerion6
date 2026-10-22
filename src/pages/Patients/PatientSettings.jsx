import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Sun, ShieldCheck, CheckCircle2, Settings2 } from "lucide-react";
import "./PatientDashboard.css";

export default function PatientSettings() {
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    localStorage.setItem("patientSettings", JSON.stringify({ notifications, reminders, dark }));
    document.documentElement.classList.toggle("dark", dark);
    setSaved(true);
  }

  return <div className={`patient-page ${dark?"patient-preview-dark":""}`}>
    <motion.div className="patient-page-title" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><div><span className="patient-eyebrow">MAKE IT YOURS</span><h1>Settings</h1><p>Manage your portal preferences.</p></div><Settings2 color="#6366f1" size={25}/></motion.div>
    <section className="patient-panel patient-settings-panel"><div className="patient-panel-heading"><div><h2>Preferences</h2><p>Choose how your patient portal behaves on this device.</p></div></div>
      <div className="patient-setting-row"><div className="patient-setting-icon"><Bell size={20}/></div><div className="patient-setting-copy"><strong>Notifications</strong><span>Show in-app notification reminders.</span></div><button role="switch" aria-checked={notifications} className={`patient-switch ${notifications?"on":""}`} onClick={()=>{setNotifications(!notifications);setSaved(false)}}><span/></button></div>
      <div className="patient-setting-row"><div className="patient-setting-icon"><ShieldCheck size={20}/></div><div className="patient-setting-copy"><strong>Exercise reminders</strong><span>Enable reminders for your planned routine.</span></div><button role="switch" aria-checked={reminders} className={`patient-switch ${reminders?"on":""}`} onClick={()=>{setReminders(!reminders);setSaved(false)}}><span/></button></div>
      <div className="patient-setting-row"><div className="patient-setting-icon">{dark?<Moon size={20}/>:<Sun size={20}/>}</div><div className="patient-setting-copy"><strong>Dark appearance</strong><span>Preview a darker style for this page.</span></div><button role="switch" aria-checked={dark} className={`patient-switch ${dark?"on":""}`} onClick={()=>{setDark(!dark);setSaved(false)}}><span/></button></div>
      <button className="patient-primary-button patient-save-settings" onClick={save}>Save preferences</button>{saved&&<p className="patient-success-message"><CheckCircle2 size={16}/> Preferences saved in this browser.</p>}
    </section>
    <p className="patient-demo-note">Preferences are saved locally on this device. Email/SMS notifications require backend support.</p>
  </div>;
}
