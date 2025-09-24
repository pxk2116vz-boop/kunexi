import { BasicField, QuestionnaireConfig, SceneField } from '../types/questionnaire'

export const basicFields: BasicField[] = [
  {
    id: 'companyName',
    label: '企业名称',
    type: 'text',
    placeholder: '请输入企业名称'
  },
  {
    id: 'industry',
    label: '所属行业',
    type: 'text',
    placeholder: '如：装备制造、电子信息等'
  },
  {
    id: 'companyScale',
    label: '企业规模（员工数/产值）',
    type: 'text',
    placeholder: '例如：800 人 / 12 亿元'
  },
  {
    id: 'mainProducts',
    label: '主要产品/服务',
    type: 'text',
    placeholder: '请输入核心产品或服务'
  },
  {
    id: 'digitalLead',
    label: '信息化负责人',
    type: 'text',
    placeholder: '负责人姓名'
  },
  {
    id: 'digitalLeadContact',
    label: '负责人联系方式',
    type: 'text',
    placeholder: '手机、邮箱或座机'
  }
]

export const sceneFields: SceneField[] = [
  {
    id: 'sceneCount',
    label: '已上线的信创应用场景数量',
    helper: '用于评估升级条件，单位：个'
  },
  {
    id: 'constrainedSceneCount',
    label: '其中约束性场景数量',
    helper: '约束性场景需满足关键业务场景认定'
  }
]

export const effectOptions = [
  { key: 'efficiency', label: '提高生产效率' },
  { key: 'cost', label: '降低成本' },
  { key: 'quality', label: '改善质量' },
  { key: 'service', label: '增强客户服务' },
  { key: 'other', label: '其他' }
]

export const questionnaireConfig: QuestionnaireConfig = {
  metadata: {
    score_scale: 100
  },
  dimensions: [
    {
      name: '数字化基础',
      weight: 0.5,
      subdimensions: [
        {
          name: '设备系统',
          weight: 0.4,
          items: [
            {
              id: 1,
              code: 'Q1',
              title: '网络建设',
              description: '是否建设工控/企业网络',
              type: 'multi',
              weight: 0.4,
              options: [
                {
                  key: 'shopfloor_network',
                  label: '已在车间建设工控网络（支撑关键产线的自动化控制）',
                  remarkPlaceholder: '说明覆盖的车间或产线'
                },
                {
                  key: 'enterprise_network',
                  label: '已建设企业级应用网络（支持数据交互与管理）',
                  remarkPlaceholder: '说明网络拓扑或支撑的系统'
                },
                {
                  key: 'redundant_design',
                  label: '网络具备带宽冗余与链路备份设计',
                  remarkPlaceholder: '填写冗余方式及带宽指标'
                },
                {
                  key: 'remote_access',
                  label: '支持远程接入并配置安全控制策略',
                  remarkPlaceholder: '说明远程访问场景与安全策略'
                }
              ],
              scoring: {
                per_option: 2,
                max_score: 8
              },
              followUps: [
                {
                  id: 'coverage',
                  label: '网络覆盖范围',
                  type: 'text',
                  placeholder: '如：全厂/关键车间/办公区域'
                },
                {
                  id: 'bandwidth',
                  label: '网络带宽及冗余情况',
                  type: 'text',
                  placeholder: '如：万兆主干+双链路备份'
                }
              ],
              remarkLabel: '网络备注'
            },
            {
              id: 2,
              code: 'Q2',
              title: '设备数字化率',
              description: '设备数字化率大约是多少？',
              type: 'single',
              weight: 0.3,
              options: [
                { key: '0-10', label: '0–10%' },
                { key: '10-20', label: '10–20%' },
                { key: '20-40', label: '20–40%' },
                { key: '40-60', label: '40–60%' },
                { key: '60+', label: '60% 以上' }
              ],
              scoring: {
                map: [0, 1.5, 3, 4.5, 6],
                max_score: 6,
                options_desc_order: true
              },
              remarkLabel: '补充说明'
            },
            {
              id: 3,
              code: 'Q3',
              title: '设备联网率',
              description: '设备联网比例大约是多少？',
              type: 'single',
              weight: 0.3,
              options: [
                { key: '0-10', label: '0–10%' },
                { key: '10-20', label: '10–20%' },
                { key: '20-40', label: '20–40%' },
                { key: '40-60', label: '40–60%' },
                { key: '60+', label: '60% 以上' }
              ],
              scoring: {
                map: [0, 1.5, 3, 4.5, 6],
                max_score: 6,
                options_desc_order: true
              },
              followUps: [
                {
                  id: 'interface',
                  label: '主要网络接口类型',
                  type: 'text',
                  placeholder: '如：OPC、Modbus、TCP/IP'
                }
              ],
              remarkLabel: '补充说明'
            }
          ]
        },
        {
          name: '数据采集',
          weight: 0.2,
          items: [
            {
              id: 4,
              code: 'Q4',
              title: '数据采集覆盖',
              description: '请选择已实现在线采集的业务环节',
              type: 'multi',
              weight: 1,
              options: [
                { key: 'production', label: '生产过程数据' },
                { key: 'quality', label: '质量检测数据' },
                { key: 'equipment', label: '设备运行状态' },
                { key: 'energy', label: '能耗与公辅系统' },
                { key: 'environment', label: '环境与排放监测' },
                { key: 'safety', label: '安全生产指标' },
                { key: 'warehouse', label: '仓储出入库数据' },
                { key: 'logistics', label: '物流运输数据' },
                { key: 'supply_chain', label: '供应链协同数据' },
                { key: 'customer', label: '客户及售后数据' },
                { key: 'finance', label: '财务经营数据' },
                { key: 'hr', label: '人力资源数据' },
                { key: 'rd', label: '研发/设计数据' },
                { key: 'maintenance', label: '设备维保数据' }
              ],
              scoring: {
                per_option: 0.7142857142857143,
                max_score: 10
              },
              remarkLabel: '采集说明'
            }
          ]
        },
        {
          name: '信息系统',
          weight: 0.2,
          items: [
            {
              id: 5,
              code: 'Q5',
              title: '信息系统覆盖',
              description: '生产执行与业务系统建设情况',
              type: 'single',
              weight: 1,
              options: [
                { key: 'none', label: '无信息化系统' },
                { key: 'basic', label: '有单点业务系统，支撑数据录入' },
                { key: 'integrated', label: '有集成的信息系统，支持计划排程' },
                { key: 'advanced', label: '系统与采购/销售/库存集成联动' },
                { key: 'intelligent', label: '智能化系统，支持多约束自动排程' }
              ],
              scoring: {
                map: [0, 2.5, 5, 7.5, 10],
                max_score: 10
              },
              followUps: [
                {
                  id: 'systemName',
                  label: '系统名称/供应商',
                  type: 'text',
                  placeholder: '如：XX MES by XX 公司'
                }
              ],
              remarkLabel: '系统说明'
            }
          ]
        },
        {
          name: '信息安全',
          weight: 0.2,
          items: [
            {
              id: 6,
              code: 'Q6',
              title: '网络安全措施',
              description: '请选择已部署的网络安全措施',
              type: 'multi',
              weight: 0.5,
              options: [
                { key: 'firewall', label: '工业防火墙/边界防护', remarkPlaceholder: '部署位置与品牌' },
                { key: 'ids', label: '入侵检测/防御系统', remarkPlaceholder: '监测对象或频率' },
                { key: 'segmentation', label: '网络分区与访问控制', remarkPlaceholder: '如：IT/OT 双域隔离' },
                { key: 'vpn', label: 'VPN/零信任远程访问', remarkPlaceholder: '说明认证方式' }
              ],
              scoring: {
                per_option: 1.25,
                max_score: 5
              },
              remarkLabel: '安全备注'
            },
            {
              id: 7,
              code: 'Q7',
              title: '数据安全措施',
              description: '请选择已落实的数据安全措施',
              type: 'multi',
              weight: 0.5,
              options: [
                { key: 'backup', label: '定期备份与异地灾备', remarkPlaceholder: '说明备份策略' },
                { key: 'encryption', label: '敏感数据加密与脱敏', remarkPlaceholder: '涉及系统或数据集' },
                { key: 'masking', label: '权限与数据分级管理', remarkPlaceholder: '涉及角色或流程' },
                { key: 'monitoring', label: '数据安全监测与审计', remarkPlaceholder: '使用平台或频率' }
              ],
              scoring: {
                per_option: 1.25,
                max_score: 5
              },
              remarkLabel: '安全备注'
            }
          ]
        }
      ]
    },
    {
      name: '数字化管理',
      weight: 0.3,
      subdimensions: [
        {
          name: '规划管理',
          weight: 0.5,
          items: [
            {
              id: 8,
              code: 'Q8',
              title: '规划实施情况',
              description: '生产计划/排程管理能力',
              type: 'single',
              weight: 0.5,
              options: [
                { key: 'none', label: '无系统，依赖人工/Excel' },
                { key: 'basic', label: '有计划管理工具，支持计划录入' },
                { key: 'semi_auto', label: '有信息化系统，支持计划生成' },
                { key: 'auto', label: '有智能化系统，支持多约束自动排程' },
                { key: 'integrated', label: '计划系统与采购/销售/库存联动' },
                { key: 'predictive', label: '具备预测与模拟能力，动态排程' }
              ],
              scoring: {
                map: [0, 1.5, 3, 4.5, 6, 7.5],
                max_score: 7.5
              },
              followUps: [
                {
                  id: 'integration',
                  label: '是否与采购、销售、库存打通',
                  type: 'text',
                  placeholder: '如：与ERP/APS 集成'
                }
              ],
              remarkLabel: '实施备注'
            },
            {
              id: 9,
              code: 'Q9',
              title: '管理机制',
              description: '请选择已建立的数字化推进机制',
              type: 'multi',
              weight: 0.5,
              options: [
                { key: 'committee', label: '成立跨部门数字化领导小组' },
                { key: 'standard', label: '制定数字化管理制度与流程' },
                { key: 'assessment', label: '建立KPI/考核机制并常态化复盘' },
                { key: 'roadmap', label: '形成年度/三年数字化建设路线图' }
              ],
              scoring: {
                per_option: 1.875,
                max_score: 7.5
              },
              remarkLabel: '机制备注'
            }
          ]
        },
        {
          name: '要素保障',
          weight: 0.5,
          items: [
            {
              id: 10,
              code: 'Q10',
              title: '人才建设',
              description: '请选择企业在数字化人才方面的保障措施',
              type: 'multi',
              weight: 0.5,
              options: [
                { key: 'team', label: '设立专职数字化团队' },
                { key: 'training', label: '建立常态化培训与认证机制' },
                { key: 'incentive', label: '设置专项激励/晋升机制' },
                { key: 'cooperate', label: '与高校/机构共建产学研项目' },
                { key: 'expert', label: '引入外部专家/顾问长期辅导' }
              ],
              scoring: {
                per_option: 1.5,
                max_score: 7.5
              },
              remarkLabel: '人才备注'
            },
            {
              id: 11,
              code: 'Q11',
              title: '资金保障',
              description: '数字化建设的预算与资金机制',
              type: 'single',
              weight: 0.5,
              options: [
                { key: 'none', label: '无专项预算' },
                { key: 'project', label: '按项目申请预算' },
                { key: 'annual', label: '设立年度数字化预算' },
                { key: 'rolling', label: '采用滚动投资机制（季度/半年度滚动）' },
                { key: 'portfolio', label: '形成多元资金组合（自筹+政府+资本）' }
              ],
              scoring: {
                map: [0, 1.875, 3.75, 5.625, 7.5],
                max_score: 7.5
              },
              remarkLabel: '资金说明'
            }
          ]
        }
      ]
    },
    {
      name: '数字化成效',
      weight: 0.2,
      subdimensions: [
        {
          name: '绿色低碳',
          weight: 0.35,
          items: [
            {
              id: 12,
              code: 'Q12',
              title: '能耗表现趋势',
              description: '数字化建设对能耗的影响',
              type: 'single',
              weight: 1,
              options: [
                { key: 'increase', label: '能耗增加' },
                { key: 'flat', label: '能耗持平' },
                { key: 'decrease', label: '能耗降低' }
              ],
              scoring: {
                map_label_to_score: {
                  increase: 0,
                  flat: 3.5,
                  decrease: 7
                },
                max_score: 7
              },
              remarkLabel: '能耗说明'
            }
          ]
        },
        {
          name: '产品质量',
          weight: 0.35,
          items: [
            {
              id: 13,
              code: 'Q13',
              title: '产品质量表现',
              description: '数字化对质量指标的影响',
              type: 'single',
              weight: 1,
              options: [
                { key: 'decrease', label: '不良率降低' },
                { key: 'flat', label: '质量持平' },
                { key: 'increase', label: '质量提升/好评增加' }
              ],
              scoring: {
                map_label_to_score: {
                  decrease: 0,
                  flat: 3.5,
                  increase: 7
                },
                max_score: 7
              },
              remarkLabel: '质量说明'
            }
          ]
        },
        {
          name: '市场效益',
          weight: 0.3,
          items: [
            {
              id: 14,
              code: 'Q14',
              title: '市场表现',
              description: '销售收入或客户拓展的变化',
              type: 'single',
              weight: 0.5,
              options: [
                { key: 'decrease', label: '下降' },
                { key: 'flat', label: '持平' },
                { key: 'increase', label: '增加' }
              ],
              scoring: {
                map_label_to_score: {
                  decrease: 0,
                  flat: 1.5,
                  increase: 3
                },
                max_score: 3
              },
              remarkLabel: '市场说明'
            },
            {
              id: 15,
              code: 'Q15',
              title: '客户满意度',
              description: '客户满意度或复购率变化',
              type: 'single',
              weight: 0.5,
              options: [
                { key: 'decrease', label: '下降' },
                { key: 'flat', label: '持平' },
                { key: 'increase', label: '增加' }
              ],
              scoring: {
                map_label_to_score: {
                  decrease: 0,
                  flat: 1.5,
                  increase: 3
                },
                max_score: 3
              },
              remarkLabel: '客户说明'
            }
          ]
        }
      ]
    },
    {
      name: '客户与产品生命周期数字化',
      weight: 0.2,
      subdimensions: [
        {
          name: '设计与工艺协同',
          weight: 0.5,
          items: [
            {
              id: 16,
              code: 'Q16',
              title: '产品设计数字化',
              description: '设计阶段的工具与管理平台',
              type: 'multi',
              weight: 0.5,
              options: [
                { key: 'cad', label: '使用 CAD/CAE/EDA 等数字化设计工具', remarkPlaceholder: '常用软件或覆盖范围' },
                { key: 'pdm', label: '建设设计数据管理系统（PDM/PLM）', remarkPlaceholder: '系统名称/版本' },
                { key: 'knowledge', label: '建设设计知识库并共享复用', remarkPlaceholder: '知识库载体或内容' }
              ],
              scoring: {
                per_option: 2,
                max_score: 6
              },
              followUps: [
                {
                  id: 'designSystem',
                  label: '设计管理系统名称',
                  type: 'text',
                  placeholder: '如：Teamcenter / Windchill'
                }
              ],
              remarkLabel: '设计备注'
            },
            {
              id: 17,
              code: 'Q17',
              title: '工艺设计数字化',
              description: '工艺设计的工具与管理平台',
              type: 'multi',
              weight: 0.5,
              options: [
                { key: 'cam', label: '使用 CAM/CAPP 等数字化工艺工具', remarkPlaceholder: '主要工具或模块' },
                { key: 'mpm', label: '建设工艺设计管理系统', remarkPlaceholder: '系统名称/使用范围' },
                { key: 'craftKnowledge', label: '建设工艺知识库', remarkPlaceholder: '知识库内容或载体' }
              ],
              scoring: {
                per_option: 2,
                max_score: 6
              },
              followUps: [
                {
                  id: 'craftSystem',
                  label: '工艺管理系统名称',
                  type: 'text',
                  placeholder: '如：CAPP 系统'
                }
              ],
              remarkLabel: '工艺备注'
            }
          ]
        },
        {
          name: '营销与服务',
          weight: 0.5,
          items: [
            {
              id: 18,
              code: 'Q18',
              title: '营销管理',
              description: '营销管理系统建设程度',
              type: 'single',
              weight: 0.4,
              options: [
                { key: 'none', label: '无营销管理系统' },
                { key: 'basic', label: '有营销管理系统（订单、客户、业绩管理）' },
                { key: 'integrated', label: '系统跨部门共享，支持分析决策' }
              ],
              scoring: {
                map: [0, 3, 6],
                max_score: 6
              },
              followUps: [
                {
                  id: 'marketingSystem',
                  label: '系统名称/供应商',
                  type: 'text',
                  placeholder: '请输入系统名称及版本'
                }
              ],
              remarkLabel: '营销备注'
            },
            {
              id: 19,
              code: 'Q19',
              title: '售后服务数字化',
              description: '售后服务系统与联动情况',
              type: 'multi',
              weight: 0.6,
              options: [
                { key: 'serviceSystem', label: '建设售后管理系统', remarkPlaceholder: '系统名称/版本' },
                { key: 'dataAccess', label: '具备接口或数据库读取权限', remarkPlaceholder: '接口类型或权限范围' },
                { key: 'integration', label: '与设计/工艺/生产/财务系统联动', remarkPlaceholder: '涉及系统及联动方式' },
                { key: 'knowledgeBase', label: '建设售后问题知识库/快速响应机制', remarkPlaceholder: '知识库形式或覆盖内容' }
              ],
              scoring: {
                per_option: 2,
                max_score: 8
              },
              followUps: [
                {
                  id: 'serviceVendor',
                  label: '系统供应商',
                  type: 'text',
                  placeholder: '请输入供应商名称'
                },
                {
                  id: 'serviceAccess',
                  label: '接口与数据权限说明',
                  type: 'text',
                  placeholder: '如：开放 REST API / 数据库直连'
                }
              ],
              remarkLabel: '售后备注'
            }
          ]
        }
      ]
    }
  ],
  upgrade_rules: {
    from_level: 2,
    to_level: 3,
    min_scenes_total: 6,
    min_constrained_scenes: 3
  }
}
