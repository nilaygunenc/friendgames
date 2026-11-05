export interface LegalCase {
  id: string;
  tr: {
    number: string; category: string; title: string; incident: string; question: string;
    views: [string, string]; evidence: string; outcome: string; takeaway: string;
  };
  en: {
    number: string; category: string; title: string; incident: string; question: string;
    views: [string, string]; evidence: string; outcome: string; takeaway: string;
  };
  source: { label: string; url: string };
}

export const legalCases: LegalCase[] = [
  {
    id: 'unknown-bullet',
    tr: {
      number: 'Yargıtay 1. CD 2018/5762 E., 2019/1750 K.', category: 'Delil, şüphe ve iştirak', title: 'İki Ateş, Tek Ölüm',
      incident: 'Bu kart, gerçek bir Yargıtay kararının anonimleştirilmiş ve sadeleştirilmiş tartışma özetidir. Kararda iki karşıt grup sokakta karşılıklı silahla ateş eder. Olayla ilgisi olmayan bir kişi, hangi taraftan geldiği belirlenemeyen mermiyle ölür. Oyundaki tartışma, iki kişinin aynı anda ateş ettiği daha dar senaryoya odaklanır.',
      question: 'Öldüren merminin hangi kişiden geldiği belirlenemiyorsa, ateş edenlerin ikisi de ölümden sorumlu tutulabilir mi?',
      views: ['İkisi de silahla ateş etmiş ve üçüncü bir kişinin vurulma ihtimalini göze almışsa, neticeden ikisi de sorumlu olmalıdır.', 'Birlikte suç işleme iradesi yoksa, hangi merminin ölüme yol açtığı ispatlanmadan mahkûmiyet kurulamaz; şüphe sanık lehine değerlendirilir.'],
      evidence: 'Yeni delil: Somut olayda ateş edenler aynı tarafta ve ortak planla hareket eden kişiler değil, karşıt gruplardadır. Ölümcül merminin hangi taraftan atıldığı teknik olarak belirlenememektedir.',
      outcome: 'Yargıtay çoğunluğu, karşıt gruplar arasında birlikte suç işleme kararı ve iştirak iradesi bulunmadığını; olası kastla işlenen suçlarda fiilen birlikte hareket etmeyen karşı gruplara müşterek faillik hükümlerinin uygulanamayacağını belirtti. Bu nedenle ölümden sorumlu fail belirlenmeden verilen mahkûmiyetleri bozdu. Kararda karşı oy da vardır.',
      takeaway: '“Herkes tehlikeli davranmıştı” demek, tek başına herkesin aynı ölüm sonucundan müşterek fail olarak sorumlu olduğu anlamına gelmez. Ortak irade, nedensellik ve ispat ayrı ayrı incelenir.',
    },
    en: {
      number: 'Court of Cassation 1st Criminal Chamber 2018/5762, 2019/1750', category: 'Evidence, doubt and participation', title: 'Two Shots, One Death',
      incident: 'This card is an anonymised, simplified discussion summary of a real Court of Cassation decision. In the decision, two opposing groups fire weapons at each other in a street. A bystander dies from a bullet whose side of origin cannot be identified. The game narrows the debate to two people firing at the same time.',
      question: 'If it cannot be determined which shooter fired the fatal bullet, can both shooters be held responsible for the death?',
      views: ['If both fired weapons and accepted the risk of a third person being hit, both should be responsible for the outcome.', 'Without a joint intent to commit the offence, a conviction cannot rest on an unproven fatal bullet; doubt must benefit the accused.'],
      evidence: 'New evidence: In the actual incident the shooters were not acting as one side under a common plan; they belonged to opposing groups. It was technically impossible to establish from which side the fatal bullet came.',
      outcome: 'The Court of Cassation majority held that opposing groups had no joint decision or intent to commit an offence together and that co-perpetration rules could not be applied to opposing groups not acting together in an offence of possible intent. It quashed the convictions because the responsible shooter was not identified. There was a dissent.',
      takeaway: '“Everyone acted dangerously” does not by itself mean everyone is a co-perpetrator of the same death. Joint intent, causation and proof must each be assessed.',
    },
    source: { label: 'Yargıtay 1. CD, E. 2018/5762, K. 2019/1750', url: 'https://hukas.com.tr/ictihat/yargitay/1-ceza-dairesi-2018-5762-esas-2019-1750-karar/066cb5c7-bd4d-4e1a-af3f-98d2e46a619f' },
  },
  {
    id: 'sports-field-death',
    tr: {
      number: 'Yargıtay 12. CD 2015/308 E., 2015/18838 K.', category: 'Spor, ihmal ve nedensellik', title: 'Spor Sahasında Ölüm',
      incident: 'Bu kart, kullanıcının verdiği futbol çarpışması senaryosunun tartışma uyarlamasıdır; kaynak kararın olgusu farklı bir spor müsabakasına ilişkindir. Bir maçta ağır ve kural dışı olduğu iddia edilen çarpışmadan sonra oyuncu hastaneye kaldırılır ve ertesi gün hayatını kaybeder. Müdahaleyi yapan oyuncu kırmızı kart görmüştür.',
      question: 'Kırmızı kart gören oyuncu ölümden otomatik olarak sorumlu tutulur mu; sporun doğal riskleri bu sonucu değiştirir mi?',
      views: ['Ağır kural ihlali ve ölüm arasında uzman raporuyla bağ kurulursa, spor bağlamı cezai sorumluluğu otomatik kaldırmaz.', 'Kırmızı kart sportif bir yaptırımdır; ceza sorumluluğu için kural ihlalinin ölümün hukuken ilgili nedeni olduğu ayrıca ispatlanmalıdır.'],
      evidence: 'Yeni delil: Emsal kararda Yargıtay, tüm müsabaka görüntülerinin uzman bilirkişilerce izlenmesini, kural içi ve kural dışı darbelerin ayrı ayrı değerlendirilmesini ve kusurlu davranışla ölüm arasındaki illiyet bağının kurulmasını istedi.',
      outcome: 'Yargıtay, eksik araştırmayla kurulan hükmü bozdu. Karar, kural ihlali veya disiplin yaptırımının tek başına yeterli olmadığını; ölüm, kusur ve nedensellik bağının uzman incelemesiyle somutlaştırılması gerektiğini vurgular. İlgili çerçeve, taksirle öldürme bakımından TCK m.85 ve taksir hükümleriyle bağlantılıdır.',
      takeaway: 'Kırmızı kart önemli bir veri olabilir ancak ceza hükmünün yerine geçmez. Sporun kabul edilen riskleri ile kural dışı, öngörülebilir ölüm riski arasındaki çizgi somut delille çizilir.',
    },
    en: {
      number: 'Court of Cassation 12th Criminal Chamber 2015/308, 2015/18838', category: 'Sport, negligence and causation', title: 'Death on the Field',
      incident: 'This card adapts the football-collision scenario provided by the user for discussion; the cited decision concerns a different sporting event. After a collision alleged to be serious and outside the rules, a player is hospitalised and dies the next day. The player making the challenge receives a red card.',
      question: 'Does a red-carded player automatically become responsible for the death, or do the inherent risks of sport change the result?',
      views: ['If expert evidence links a serious rule breach to the death, the sporting context does not automatically remove criminal responsibility.', 'A red card is a sporting sanction; criminal responsibility separately requires proof that the breach is a legally relevant cause of death.'],
      evidence: 'New evidence: In the precedent, the Court of Cassation required experts to view all match footage, assess lawful and unlawful blows separately and establish the causal link between culpable conduct and death.',
      outcome: 'The Court of Cassation quashed the judgment because the inquiry was incomplete. It stresses that a rule breach or disciplinary sanction alone is insufficient; death, fault and causation must be concretely established by expert examination. The framework relates to negligent homicide under TPC Article 85 and negligence provisions.',
      takeaway: 'A red card can be significant evidence but it does not replace a criminal-law analysis. The line between accepted sporting risk and an unlawful, foreseeable risk of death must be drawn from concrete evidence.',
    },
    source: { label: 'Yargıtay 12. CD, E. 2015/308, K. 2015/18838 (ilgili spor içtihadı)', url: 'https://librumhukuk.com/karar/yargitay/2217817/12-ceza-dairesi-e-2015-308-k-2015-18838/' },
  },
  {
    id: 'joke-or-killing',
    tr: {
      number: 'Yargıtay 1. CD 2023/5960 E., 2024/5 K.', category: 'Olası kast ve silah', title: 'Şaka mı, Öldürme mi?',
      incident: 'Gerçek kararda iki arkadaş, emanet bırakılmış gerçek bir silahın iadesi için buluşur. Silahı eline alan kişi, arkadaşına doğrultarak şaka yollu “Sıkayım mı?” der. Arkadaşı gülerek “Sık sık!” diye yanıt verir. Silah ateş alır ve arkadaş yaşamını yitirir.',
      question: 'Bu olay kaza, bilinçli taksir veya olası kastla öldürme olarak mı değerlendirilmelidir?',
      views: ['Şaka, öldürme isteğini göstermez; olayda ölüm ihtimali öngörülmüş ama istenmemişse bilinçli taksir gündeme gelebilir.', 'Gerçek silahı kişiye doğrultup tetiğe dokunmak, silahın ateş alabileceğini ve ölüm doğurabileceğini öngörerek bu sonuca kayıtsız kalmaktır; olası kast oluşur.'],
      evidence: 'Yeni delil: Kararda failin silahı arkadaşına iade ederken namluyu ona yönelttiği ve tetiğe dokunduğu kabul edilir. Aralarında öldürmeyi gerektirecek bir husumet bulunmaması, silahın gerçek ve tehlikeli niteliğini ortadan kaldırmaz.',
      outcome: 'Yargıtay, suça sürüklenen çocuk hakkında TCK m.82/1-e, m.21/2, m.31/3 ve m.62/1 uyarınca olası kastla nitelikli öldürme nedeniyle verilen 11 yıl 5 ay 15 gün hapis cezasına ilişkin hükmü onadı. Karar, ölümün istenmemiş olmasının tek başına olası kastı dışlamadığını; ölüm ihtimalini öngörüp sonuca kayıtsız kalmanın belirleyici olduğunu kabul eder.',
      takeaway: 'Mağdurun “sık” demesi, silahı güvenli hâle getirmez ve failin özen yükümlülüğünü ortadan kaldırmaz. Şaka bağlamı, silahın doğrultulması ve tetiğe dokunulmasıyla ortaya çıkan risk değerlendirmesinin yalnız bir parçasıdır.',
    },
    en: {
      number: 'Court of Cassation 1st Criminal Chamber 2023/5960, 2024/5', category: 'Possible intent and firearms', title: 'A Joke or a Killing?',
      incident: 'In the real decision, two friends meet so that a real firearm left for safekeeping can be returned. The person holding it points it at the friend and jokingly asks, “Should I shoot?” The friend laughs and replies, “Shoot, shoot!” The gun fires and the friend dies.',
      question: 'Should this be treated as an accident, conscious negligence or killing with possible intent?',
      views: ['A joke does not show an intent to kill; where death was foreseen but not desired, conscious negligence may be considered.', 'Pointing a real gun at a person and touching the trigger foresees that it can fire and kill, while remaining indifferent to that outcome; possible intent is formed.'],
      evidence: 'New evidence: The decision finds that the offender pointed the barrel at the friend and touched the trigger while returning the weapon. The absence of a motive to kill does not remove the firearm’s real and dangerous nature.',
      outcome: 'The Court of Cassation upheld a sentence of 11 years, 5 months and 15 days for aggravated killing with possible intent, applied under TPC Articles 82/1-e, 21/2, 31/3 and 62/1 to the child offender. The decision accepts that an unwanted death does not alone exclude possible intent where the likelihood of death is foreseen and the actor remains indifferent.',
      takeaway: 'The victim saying “shoot” does not make the gun safe or remove the holder’s duty of care. The joking context is only one part of assessing the risk created by pointing the firearm and touching the trigger.',
    },
    source: { label: 'Yargıtay 1. CD, E. 2023/5960, K. 2024/5, 8/1/2024', url: 'https://denizcankizil.tr/hukukihaber/yargitay-1-ceza-dairesinin-2023-5960-e-ve-2024-5-k-sayili-karari/' },
  },
  {
    id: 'emergency-treatment',
    tr: {
      number: 'AYM 2019/2549', category: 'İhmal ve sorumluluk', title: 'İleri Tedaviye Sevk',
      incident: 'Bir ev yangınından sonra ağır durumdaki iki kardeş hastanelere kaldırılır. İlk müdahaleden sonra daha ileri bir tedaviye ihtiyaç duyulur; ancak onları kabul edecek bir merkez bulunamaz. Yakınları, sağlık sistemindeki organizasyon ve soruşturma eksikliklerinin ölümle bağlantısını tartışmaya açar.',
      question: 'Bir hastanın kabul edilmesini sağlayacak merkez bulunamaması, tek başına kamu makamlarının sorumluluğunu doğurur mu?',
      views: ['Olayın ağırlığı ve tedavi ihtiyacı biliniyorsa kamu makamlarının koordinasyon yükümlülüğü vardır.', 'Tıbbi sonuç ile idari eksiklik arasındaki nedensellik her olayda ayrıca ve somut biçimde kanıtlanmalıdır.'],
      evidence: 'Yeni delil: İleri tedavi için sevk gündeme gelmiş, fakat kardeşleri kabul edebilecek bir hastane bulunamamıştır. Tartışma yalnız tedaviye değil, sürecin etkili soruşturulup soruşturulmadığına da döner.',
      outcome: 'Anayasa Mahkemesi, başvuruda Anayasa’nın 17. maddesi kapsamındaki yaşam hakkının usul boyutunun ihlal edildiğine karar verdi. Karar, olayın esasına dair ceza sorumluluğunu doğrudan yeniden kurmaz; etkili inceleme yükümlülüğüne odaklanır.',
      takeaway: 'Bir olayın vicdani ağırlığı ile mahkemenin incelediği hukuki soru aynı olmayabilir. Bu kartta kritik ayrım, ölümün nedeni ile soruşturmanın yeterliliğidir.',
    },
    en: {
      number: 'Constitutional Court 2019/2549', category: 'Negligence and responsibility', title: 'Referral for Advanced Treatment',
      incident: 'After a house fire, two siblings in critical condition are taken to hospital. Following initial treatment they need more advanced care, but no accepting centre can be found. Their family challenges the possible link between system coordination, the investigation, and the deaths.',
      question: 'Does the inability to find a hospital that will accept a patient, by itself, create responsibility for public authorities?',
      views: ['If the severity and treatment need are known, public authorities have a duty to coordinate.', 'Causation between an administrative failure and the medical outcome must be proved concretely in each case.'],
      evidence: 'New evidence: referral for advanced treatment was considered, but no hospital able to accept the siblings could be found. The debate shifts to whether the process was investigated effectively as well as treatment.',
      outcome: 'The Constitutional Court found a violation of the procedural aspect of the right to life under Article 17 of the Constitution. It did not itself remake the criminal-liability assessment; it focused on the duty of effective examination.',
      takeaway: 'The moral weight of an event and the legal question a court examines can differ. The key distinction here is between the cause of death and the adequacy of the investigation.',
    },
    source: { label: 'AYM: Ali Karakılıç ve diğerleri, B. No: 2019/2549, 21/9/2022', url: 'https://kararlarbilgibankasi.anayasa.gov.tr/kbb/BB/2019/2549' },
  },
  {
    id: 'linked-convictions',
    tr: {
      number: 'AYM 2020/39936', category: 'Delil ve şüphe', title: 'Bağlantılı Dosyalar',
      incident: 'Bir kişi hakkında bağlantılı olduğu ileri sürülen iki ceza dosyası vardır. Dosyalardan biri temyiz incelemesindeyken, diğer dosyadaki hüküm istinaf aşamasında kesinleşir ve infaz sürecine geçilir. Başvurucu, bağlantılı değerlendirmeler tamamlanmadan kesinleşmenin adil olup olmadığını sorgular.',
      question: 'Bağlantılı dosyalardan biri henüz incelenirken diğerinin kesinleşmesi, adil yargılanma ve masumiyet karinesi bakımından sorun yaratır mı?',
      views: ['Bağlantılı deliller birlikte değerlendirilmeden kesinleşen hüküm, çelişkili sonuç ve telafisi zor bir durum yaratabilir.', 'Her dosya kendi deliline dayanıyorsa yargısal süreçler farklı zamanlarda sonuçlanabilir.'],
      evidence: 'Yeni delil: Dosyalardan birinde temyiz incelemesi sürerken diğer dosyanın hükmü kesinleşmiş ve infaza geçilmiştir. Böylece “şüpheden sanık yararlanır” ilkesi ve bağlantılı delillerin etkisi tartışmanın merkezine gelir.',
      outcome: 'Anayasa Mahkemesi Genel Kurulu 27/1/2026 tarihli kararında hakkaniyete uygun yargılanma hakkı ve kişi hürriyeti ile güvenliği hakkı yönünden ihlal sonucuna ulaştı. Değerlendirme Anayasa’nın 19., 36. ve 38. maddeleri çerçevesindedir.',
      takeaway: 'Delil tek tek güçlü görünse bile, bağlantılı dosyaların birbirini nasıl etkilediği sonucu değiştirebilir. Kesinleşme zamanı da adalet tartışmasının parçasıdır.',
    },
    en: {
      number: 'Constitutional Court 2020/39936', category: 'Evidence and doubt', title: 'Linked Cases',
      incident: 'A person faces two allegedly linked criminal cases. While one is under appeal, the judgment in the other becomes final at the regional-appeal stage and execution begins. The applicant challenges whether finalisation before the linked assessment is complete is fair.',
      question: 'When one of two linked cases is still under review, can the other becoming final raise fair-trial and presumption-of-innocence concerns?',
      views: ['A final judgment before linked evidence is assessed together can create conflicting results and hard-to-repair consequences.', 'If each file rests on its own evidence, judicial proceedings may conclude at different times.'],
      evidence: 'New evidence: execution began for one file while appellate review of the other was still pending. The effect of linked evidence and the principle of benefit of doubt move to the centre of the debate.',
      outcome: 'In its 27 January 2026 decision, the Constitutional Court General Assembly found violations concerning the right to a fair trial and the right to liberty and security. The assessment was under Articles 19, 36 and 38 of the Constitution.',
      takeaway: 'Even if each piece of evidence seems strong alone, the way linked cases affect one another can change the outcome. The timing of finalisation can itself be part of the justice question.',
    },
    source: { label: 'AYM: Fatma İyitütüncü, B. No: 2020/39936, 27/1/2026', url: 'https://kararlarbilgibankasi.anayasa.gov.tr/kbb/BB/2020/39936' },
  },
];
